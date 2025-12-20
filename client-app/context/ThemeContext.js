import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme(); // 'light' or 'dark'
    const [themeMode, setThemeMode] = useState('system'); // 'light', 'dark', 'system'
    const [isLoading, setIsLoading] = useState(true);

    // 実際に適用されるテーマを計算
    const getActiveTheme = () => {
        if (themeMode === 'system') {
            return systemColorScheme || 'light';
        }
        return themeMode;
    };

    const activeTheme = getActiveTheme();

    // テーマカラーの定義
    const colors = {
        light: {
            background: '#fff',
            secondaryBackground: '#f5f5f5',
            text: '#333',
            secondaryText: '#666',
            border: '#e0e0e0',
            primary: '#007AFF',
            card: '#fff',
            icon: '#333',
            inactive: '#999',
        },
        dark: {
            background: '#000',
            secondaryBackground: '#1c1c1e',
            text: '#fff',
            secondaryText: '#a0a0a0',
            border: '#38383a',
            primary: '#0a84ff',
            card: '#1c1c1e',
            icon: '#fff',
            inactive: '#666',
        },
    };

    const theme = {
        mode: themeMode,
        activeTheme: activeTheme,
        colors: colors[activeTheme],
        isDark: activeTheme === 'dark',
    };

    // 初回読み込み時にテーマ設定を取得
    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('app_theme');
            if (savedTheme) {
                setThemeMode(savedTheme);
            }
        } catch (error) {
            console.error('テーマの読み込みエラー:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const changeTheme = async (newTheme) => {
        try {
            await AsyncStorage.setItem('app_theme', newTheme);
            setThemeMode(newTheme);
        } catch (error) {
            console.error('テーマの保存エラー:', error);
        }
    };

    return (
        <ThemeContext.Provider 
            value={{ 
                theme, 
                changeTheme, 
                isLoading,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

