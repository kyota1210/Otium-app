import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const ThreadScreen = () => {
    const { theme } = useTheme();
    
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <Text style={[styles.text, { color: theme.colors.text }]}>スレッド</Text>
            <Text style={[styles.subText, { color: theme.colors.secondaryText }]}>ここにはスレッド一覧が表示されます</Text>
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
