import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// ステータスバーとナビゲーションをラップするコンポーネント
const AppContent = () => {
  const { theme } = useTheme();
  
  return (
    <>
      {/* ステータスバーのスタイルをテーマに応じて変更 */}
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <NavigationContainer>
        <AppNavigator /> 
      </NavigationContainer>
    </>
  );
};

// アプリ全体をNavigationContainerでラップし、認証コンテキスト（状態管理）を設定するシンプルな役割
export default function App() {
  return (
    // 認証情報と機能（ログイン/ログアウト）をアプリ全体で利用可能にする
    <AuthProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}