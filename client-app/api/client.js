import { AuthContext } from '../context/AuthContext';
import { useContext, useCallback } from 'react';
import axios from 'axios';
import { getToken } from './auth';
import { API_BASE_URL } from '../config';
import { Alert } from 'react-native';

// 共通APIクライアントを返すフック
export const useApiClient = () => {
    // AuthContextから現在のトークンと認証機能を取得
    const { userToken, authContext } = useContext(AuthContext);

    // 共通の処理をラップしたfetch関数を返す
    const apiFetch = useCallback(async (endpoint, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // ログイン済みの場合はAuthorizationヘッダーを追加
        if (userToken) {
            headers['Authorization'] = `Bearer ${userToken}`;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: headers,
                // GET/DELETE以外はbodyをJSON文字列化
                body: options.body ? JSON.stringify(options.body) : undefined,
            });

            const data = await response.json();

            if (!response.ok) {
                // 401エラー（未認証）の場合の処理
                if (response.status === 401) {
                    Alert.alert(
                        "認証エラー",
                        "セッションの有効期限が切れました。再度ログインしてください。",
                        [
                            { 
                                text: "OK", 
                                onPress: () => {
                                    // OKボタン押下時にログアウト処理を実行
                                    authContext.signOut();
                                }
                            }
                        ]
                    );
                    // エラーを投げて、呼び出し元で不要な処理が続かないようにする
                    throw new Error('Unauthorized');
                }

                // サーバーからのエラーメッセージを取得
                throw new Error(data.message || 'APIリクエストに失敗しました。');
            }

            return data;
        } catch (error) {
            // Unauthorizedエラーはすでにハンドリングしているので再スロー
            // それ以外もそのままスロー
            throw error;
        }
    }, [userToken, authContext]);

    return { apiFetch };
};
