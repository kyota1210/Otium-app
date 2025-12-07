import { AuthContext } from '../context/AuthContext';
import { useContext, useCallback } from 'react';

const API_BASE_URL = 'http://192.168.1.148:3000/api'; 

// 共通APIクライアントを返すフック
export const useApiClient = () => {
    // AuthContextから現在のトークンを取得
    const { userToken } = useContext(AuthContext);

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
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: headers,
            // GET/DELETE以外はbodyをJSON文字列化
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        // 認証エラー (401) の場合は、AuthContextでログアウト処理を走らせることも可能ですが、
        // 今回はシンプルにエラーとして処理します。
        
        const data = await response.json();

        if (!response.ok) {
            // サーバーからのエラーメッセージを取得
            throw new Error(data.message || 'APIリクエストに失敗しました。');
        }

        return data;
    }, [userToken]);

    return { apiFetch };
};