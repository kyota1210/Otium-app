import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config';

// ユーザー登録（サインアップ）API
export const signup = async ({ email, user_name, password }) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, user_name, password }),
    });

    // レスポンスのContent-Typeを確認
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`サーバーエラー: 期待されるJSONレスポンスが返されませんでした。ステータス: ${response.status}`);
    }

    // サーバーからのレスポンスをJSONとして解析
    const data = await response.json();

    if (!response.ok) {
        // サーバーがエラーコード（4xx, 5xx）を返した場合
        throw new Error(data.message || 'サインアップに失敗しました');
    }

    return data; // 成功データ（userIdなど）を返す
};

// ログインAPI
export const login = async ({ email, password }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    // レスポンスのContent-Typeを確認
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`サーバーエラー: 期待されるJSONレスポンスが返されませんでした。ステータス: ${response.status}`);
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'ログインに失敗しました');
    }

    return data; // 成功データ（tokenとuser情報）を返す
};

// ログイン中のユーザー情報を取得API
export const getUserInfo = async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`サーバーエラー: 期待されるJSONレスポンスが返されませんでした。ステータス: ${response.status}`);
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'ユーザー情報の取得に失敗しました');
    }

    return data; // 成功データ（user情報）を返す
};