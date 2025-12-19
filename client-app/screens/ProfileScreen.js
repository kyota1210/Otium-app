import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = () => {
    const { authContext, userInfo } = useContext(AuthContext);

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
        <View style={styles.container}>
            {/* ユーザー情報セクション */}
            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle-outline" size={100} color="#007AFF" />
                </View>
                
                {userInfo && (
                    <>
                        <Text style={styles.userName}>{userInfo.user_name || 'ユーザー'}</Text>
                        <Text style={styles.userEmail}>{userInfo.email || ''}</Text>
                    </>
                )}
                
                {!userInfo && (
                    <Text style={styles.userName}>マイページ</Text>
                )}
            </View>

            {/* メニューセクション */}
            <View style={styles.menuSection}>
                {/* 今後の拡張用: 設定項目などを追加可能 */}
                {/* 
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="settings-outline" size={24} color="#333" />
                    <Text style={styles.menuText}>設定</Text>
                    <Ionicons name="chevron-forward" size={24} color="#999" />
                </TouchableOpacity>
                */}
            </View>

            {/* ログアウトボタン */}
            <View style={styles.logoutSection}>
                <TouchableOpacity 
                    style={styles.logoutButton} 
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                    <Text style={styles.logoutText}>ログアウト</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    profileSection: {
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatarContainer: {
        marginBottom: 16,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
    },
    menuSection: {
        backgroundColor: '#fff',
        marginTop: 20,
        paddingVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
    },
    logoutSection: {
        marginTop: 'auto',
        padding: 20,
        paddingBottom: 40,
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF3B30',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    logoutText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FF3B30',
        marginLeft: 8,
    },
});

export default ProfileScreen;
