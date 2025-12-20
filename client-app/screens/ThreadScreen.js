import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const ThreadScreen = () => {
    const { theme } = useTheme();
    const { t } = useLanguage();
    
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <Text style={[styles.text, { color: theme.colors.text }]}>{t('threads')}</Text>
            <Text style={[styles.subText, { color: theme.colors.secondaryText }]}>
                {t('threadsDescription')}
            </Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
    },
});

export default ThreadScreen;
