import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
    const { userInfo, authContext } = useContext(AuthContext);

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
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* トップナビゲーションバー */}
            <View style={styles.topNavBar}>
                <Text style={styles.headerTitle}>設定</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                {/* アカウント設定セクション */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>アカウント設定</Text>
                    <View style={styles.menuSection}>
                        <TouchableOpacity 
                            style={styles.menuItem}
                            onPress={() => navigation.navigate('LoginInfo')}
                        >
                            <Ionicons name="key-outline" size={24} color="#333" />
                            <Text style={styles.menuText}>ログイン情報の変更</Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.menuItem}
                            onPress={() => navigation.navigate('PremiumPlan')}
                        >
                            <Ionicons name="diamond-outline" size={24} color="#333" />
                            <Text style={styles.menuText}>プレミアムプランの設定</Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Otium設定セクション */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Otium設定</Text>
                    <View style={styles.menuSection}>
                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="list-outline" size={24} color="#333" />
                            <Text style={styles.menuText}>カテゴリ管理</Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="options-outline" size={24} color="#333" />
                            <Text style={styles.menuText}>表示設定</Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* アプリ設定セクション */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>アプリ設定</Text>
                    <View style={styles.menuSection}>
                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="notifications-outline" size={24} color="#333" />
                            <Text style={styles.menuText}>通知設定</Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="language-outline" size={24} color="#333" />
                            <Text style={styles.menuText}>言語設定</Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="color-palette-outline" size={24} color="#333" />
                            <Text style={styles.menuText}>テーマ</Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* その他セクション */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>その他</Text>
                    <View style={styles.menuSection}>
                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="help-circle-outline" size={24} color="#333" />
                            <Text style={styles.menuText}>ヘルプ</Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="information-circle-outline" size={24} color="#333" />
                            <Text style={styles.menuText}>アプリについて</Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="document-text-outline" size={24} color="#333" />
                            <Text style={styles.menuText}>利用規約</Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="shield-checkmark-outline" size={24} color="#333" />
                            <Text style={styles.menuText}>プライバシーポリシー</Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
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
        backgroundColor: '#f5f5f5',
    },
    topNavBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
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
        color: '#666',
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    menuSection: {
        backgroundColor: '#fff',
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
        color: '#333',
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
