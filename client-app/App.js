import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';

// アプリ全体をNavigationContainerでラップし、認証コンテキスト（状態管理）を設定するシンプルな役割
export default function App() {
  return (
    // 認証情報と機能（ログイン/ログアウト）をアプリ全体で利用可能にする
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator /> 
      </NavigationContainer>
    </AuthProvider>
  );
}