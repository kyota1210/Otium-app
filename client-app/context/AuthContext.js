import React, { createContext, useState, useEffect, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login, signup, getUserInfo } from '../api/auth'; 

export const AuthContext = createContext();

// トークンを保存するキー
const TOKEN_KEY = 'userToken';

export const AuthProvider = ({ children }) => {
    // 状態管理
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null); // JWTトークン
    const [userInfo, setUserInfo] = useState(null); // ユーザー情報 (ID, 名前など)

    // --- 認証トークンの読み込み（アプリ起動時） ---
    useEffect(() => {
        const bootstrapAsync = async () => {
            let token;
            try {
                token = await SecureStore.getItemAsync(TOKEN_KEY);
                
                if (token) {
                    // トークンがある場合、ユーザー情報を取得
                    try {
                        const data = await getUserInfo(token);
                        setUserInfo(data.user);
                    } catch (error) {
                        console.error('ユーザー情報取得エラー:', error);
                        // トークンが無効な場合は削除
                        await SecureStore.deleteItemAsync(TOKEN_KEY);
                        token = null;
                    }
                }
            } catch (e) {
                console.error('トークン読み込みエラー', e);
            }
            setUserToken(token);
            setIsLoading(false);
        };
        bootstrapAsync();
    }, []);

    // --- 認証機能の定義 ---
    const authContext = useMemo(() => ({
        // ログイン機能
        signIn: async (email, password) => {
            try {
                const data = await login({ email, password });
                
                // SecureStoreにトークンを保存
                await SecureStore.setItemAsync(TOKEN_KEY, data.token);
                // 状態を更新
                setUserToken(data.token);
                setUserInfo(data.user);

                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // サインアップ機能
        signUp: async (email, user_name, password) => {
            try {
                await signup({ email, user_name, password });
                // サインアップ成功後、ログイン処理を実行
                return await authContext.signIn(email, password); 
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // ログアウト機能
        signOut: async () => {
            try {
                // SecureStoreからトークンを削除
                await SecureStore.deleteItemAsync(TOKEN_KEY);
                // 状態をリセット
                setUserToken(null);
                setUserInfo(null);
            } catch (e) {
                console.error('ログアウトエラー', e);
            }
        },

        // ユーザー情報を更新
        updateUserInfo: (newUserInfo) => {
            setUserInfo(newUserInfo);
        },
    }), []);


    return (
        <AuthContext.Provider value={{ 
            authContext, 
            isLoading, 
            userToken, 
            userInfo 
        }}>
            {children}
        </AuthContext.Provider>
    );
};