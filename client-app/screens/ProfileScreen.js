import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
    const { userInfo, authContext } = useContext(AuthContext);
    const { theme } = useTheme();

    const handleLogout = () => {
        Alert.alert(
            'ログアウト',
            'ログアウトしますか？',
            [
                {
                    text: 'キャンセル',
                    style: 'cancel',
                },
                {
                    text: 'ログアウト',
                    style: 'destructive',
                    onPress: async () => {
                        await authContext.signOut();
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            {/* トップナビゲーションバー */}
            <View style={[styles.topNavBar, { 
                backgroundColor: theme.colors.background,
                borderBottomColor: theme.colors.border 
            }]}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>設定</Text>
            </View>

            <ScrollView style={[styles.scrollView, { backgroundColor: theme.colors.secondaryBackground }]}>
                {/* アカウント設定セクション */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.secondaryText }]}>アカウント設定</Text>
                    <View style={[styles.menuSection, { backgroundColor: theme.colors.card }]}>
                        <TouchableOpacity 
                            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
                            onPress={() => navigation.navigate('LoginInfo')}
                        >
                            <Ionicons name="key-outline" size={24} color={theme.colors.icon} />
                            <Text style={[styles.menuText, { color: theme.colors.text }]}>ログイン情報の変更</Text>
                            <Ionicons name="chevron-forward" size={24} color={theme.colors.inactive} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
                            onPress={() => navigation.navigate('PremiumPlan')}
                        >
                            <Ionicons name="diamond-outline" size={24} color={theme.colors.icon} />
                            <Text style={[styles.menuText, { color: theme.colors.text }]}>プレミアムプランの設定</Text>
                            <Ionicons name="chevron-forward" size={24} color={theme.colors.inactive} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Otium設定セクション */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.secondaryText }]}>Otium設定</Text>
                    <View style={[styles.menuSection, { backgroundColor: theme.colors.card }]}>
                        <TouchableOpacity 
                            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
                            onPress={() => navigation.navigate('CategoryManagement')}
                        >
                            <Ionicons name="list-outline" size={24} color={theme.colors.icon} />
                            <Text style={[styles.menuText, { color: theme.colors.text }]}>カテゴリー管理</Text>
                            <Ionicons name="chevron-forward" size={24} color={theme.colors.inactive} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
                            <Ionicons name="options-outline" size={24} color={theme.colors.icon} />
                            <Text style={[styles.menuText, { color: theme.colors.text }]}>表示設定</Text>
                            <Ionicons name="chevron-forward" size={24} color={theme.colors.inactive} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* アプリ設定セクション */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.secondaryText }]}>アプリ設定</Text>
                    <View style={[styles.menuSection, { backgroundColor: theme.colors.card }]}>
                        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
                            <Ionicons name="notifications-outline" size={24} color={theme.colors.icon} />
                            <Text style={[styles.menuText, { color: theme.colors.text }]}>通知設定</Text>
                            <Ionicons name="chevron-forward" size={24} color={theme.colors.inactive} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
                            <Ionicons name="language-outline" size={24} color={theme.colors.icon} />
                            <Text style={[styles.menuText, { color: theme.colors.text }]}>言語設定</Text>
                            <Ionicons name="chevron-forward" size={24} color={theme.colors.inactive} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
                            onPress={() => navigation.navigate('ThemeSetting')}
                        >
                            <Ionicons name="color-palette-outline" size={24} color={theme.colors.icon} />
                            <Text style={[styles.menuText, { color: theme.colors.text }]}>テーマ</Text>
                            <Ionicons name="chevron-forward" size={24} color={theme.colors.inactive} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* その他セクション */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.secondaryText }]}>その他</Text>
                    <View style={[styles.menuSection, { backgroundColor: theme.colors.card }]}>
                        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
                            <Ionicons name="help-circle-outline" size={24} color={theme.colors.icon} />
                            <Text style={[styles.menuText, { color: theme.colors.text }]}>ヘルプ</Text>
                            <Ionicons name="chevron-forward" size={24} color={theme.colors.inactive} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
                            <Ionicons name="information-circle-outline" size={24} color={theme.colors.icon} />
                            <Text style={[styles.menuText, { color: theme.colors.text }]}>アプリについて</Text>
                            <Ionicons name="chevron-forward" size={24} color={theme.colors.inactive} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
                            <Ionicons name="document-text-outline" size={24} color={theme.colors.icon} />
                            <Text style={[styles.menuText, { color: theme.colors.text }]}>利用規約</Text>
                            <Ionicons name="chevron-forward" size={24} color={theme.colors.inactive} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
                            <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.icon} />
                            <Text style={[styles.menuText, { color: theme.colors.text }]}>プライバシーポリシー</Text>
                            <Ionicons name="chevron-forward" size={24} color={theme.colors.inactive} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ログアウトボタン */}
                <View style={styles.logoutSection}>
                    <TouchableOpacity 
                        style={styles.logoutButton} 
                        onPress={handleLogout}
                        activeOpacity={0.6}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                        <Text style={styles.logoutText}>ログアウト</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topNavBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    menuSection: {
        paddingVertical: 0,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
    },
    menuSubText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    logoutSection: {
        marginTop: 40,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    logoutText: {
        fontSize: 14,
        color: '#FF3B30',
        marginLeft: 6,
    },
});

export default ProfileScreen;
