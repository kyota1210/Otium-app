import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const ThemeSettingScreen = ({ navigation }) => {
    const { theme, changeTheme } = useTheme();

    const themeOptions = [
        {
            id: 'light',
            title: 'ライトモード',
            description: '明るいテーマで表示します',
            icon: 'sunny',
        },
        {
            id: 'dark',
            title: 'ダークモード',
            description: '暗いテーマで表示します',
            icon: 'moon',
        },
        {
            id: 'system',
            title: 'システム設定に従う',
            description: 'デバイスの設定に合わせて自動で切り替わります',
            icon: 'phone-portrait',
        },
    ];

    const handleThemeSelect = (themeId) => {
        changeTheme(themeId);
    };

    return (
        <SafeAreaView 
            style={[styles.container, { backgroundColor: theme.colors.background }]} 
            edges={['top']}
        >
            {/* ヘッダー */}
            <View style={[styles.header, { 
                backgroundColor: theme.colors.background,
                borderBottomColor: theme.colors.border 
            }]}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.icon} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    テーマ
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView 
                style={[styles.scrollView, { backgroundColor: theme.colors.secondaryBackground }]}
                contentContainerStyle={styles.scrollContent}
            >
                {/* 説明文 */}
                <View style={styles.descriptionSection}>
                    <Text style={[styles.descriptionText, { color: theme.colors.secondaryText }]}>
                        アプリの表示テーマを選択してください
                    </Text>
                </View>

                {/* テーマ選択リスト */}
                <View style={[styles.optionsContainer, { backgroundColor: theme.colors.card }]}>
                    {themeOptions.map((option, index) => {
                        const isSelected = theme.mode === option.id;
                        const isLast = index === themeOptions.length - 1;

                        return (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.optionItem,
                                    !isLast && { 
                                        borderBottomWidth: 1, 
                                        borderBottomColor: theme.colors.border 
                                    }
                                ]}
                                onPress={() => handleThemeSelect(option.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.optionIconContainer}>
                                    <Ionicons 
                                        name={option.icon} 
                                        size={28} 
                                        color={isSelected ? theme.colors.primary : theme.colors.icon} 
                                    />
                                </View>
                                <View style={styles.optionTextContainer}>
                                    <Text style={[
                                        styles.optionTitle, 
                                        { color: theme.colors.text }
                                    ]}>
                                        {option.title}
                                    </Text>
                                    <Text style={[
                                        styles.optionDescription, 
                                        { color: theme.colors.secondaryText }
                                    ]}>
                                        {option.description}
                                    </Text>
                                </View>
                                {isSelected && (
                                    <View style={styles.checkmarkContainer}>
                                        <Ionicons 
                                            name="checkmark-circle" 
                                            size={24} 
                                            color={theme.colors.primary} 
                                        />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* プレビュー情報 */}
                <View style={styles.previewSection}>
                    <Text style={[styles.previewLabel, { color: theme.colors.secondaryText }]}>
                        現在のテーマ
                    </Text>
                    <View style={[
                        styles.previewCard, 
                        { 
                            backgroundColor: theme.colors.card,
                            borderColor: theme.colors.border 
                        }
                    ]}>
                        <View style={styles.previewHeader}>
                            <Ionicons 
                                name={theme.isDark ? 'moon' : 'sunny'} 
                                size={20} 
                                color={theme.colors.primary} 
                            />
                            <Text style={[styles.previewTitle, { color: theme.colors.text }]}>
                                {theme.isDark ? 'ダークモード' : 'ライトモード'}
                            </Text>
                        </View>
                        <Text style={[styles.previewDescription, { color: theme.colors.secondaryText }]}>
                            {theme.mode === 'system' 
                                ? 'システム設定に従って自動的に適用されています' 
                                : 'このテーマが適用されています'}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 32,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    descriptionSection: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 20,
    },
    optionsContainer: {
        marginHorizontal: 16,
        borderRadius: 12,
        overflow: 'hidden',
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        // Android shadow
        elevation: 2,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    optionIconContainer: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 13,
        lineHeight: 18,
    },
    checkmarkContainer: {
        marginLeft: 12,
    },
    previewSection: {
        marginTop: 32,
        paddingHorizontal: 20,
    },
    previewLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    previewCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    previewTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    previewDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
});

export default ThemeSettingScreen;

