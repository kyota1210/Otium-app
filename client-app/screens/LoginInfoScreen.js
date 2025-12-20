import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginInfoScreen = ({ navigation }) => {
    const { userInfo } = useContext(AuthContext);
    const [email, setEmail] = useState(userInfo?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdateEmail = () => {
        // TODO: メールアドレス更新APIを呼び出す
        Alert.alert('確認', 'メールアドレスを変更しますか？', [
            { text: 'キャンセル', style: 'cancel' },
            { 
                text: '変更', 
                onPress: () => {
                    Alert.alert('完了', 'メールアドレスを変更しました');
                }
            }
        ]);
    };

    const handleUpdatePassword = () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('エラー', '新しいパスワードが一致しません');
            return;
        }
        // TODO: パスワード更新APIを呼び出す
        Alert.alert('完了', 'パスワードを変更しました', [
            {
                text: 'OK',
                onPress: () => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                }
            }
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* トップナビゲーションバー */}
            <View style={styles.topNavBar}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ログイン情報の変更</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView}>
                {/* メールアドレス変更 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>メールアドレス</Text>
                    <View style={styles.card}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>現在のメールアドレス</Text>
                            <Text style={styles.currentValue}>{userInfo?.email || ''}</Text>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>新しいメールアドレス</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="新しいメールアドレスを入力"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={handleUpdateEmail}
                        >
                            <Text style={styles.buttonText}>メールアドレスを変更</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* パスワード変更 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>パスワード</Text>
                    <View style={styles.card}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>現在のパスワード</Text>
                            <TextInput
                                style={styles.input}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                placeholder="現在のパスワードを入力"
                                placeholderTextColor="#999"
                                secureTextEntry
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>新しいパスワード</Text>
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="新しいパスワードを入力"
                                placeholderTextColor="#999"
                                secureTextEntry
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>新しいパスワード（確認）</Text>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="新しいパスワードを再入力"
                                placeholderTextColor="#999"
                                secureTextEntry
                            />
                        </View>
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={handleUpdatePassword}
                        >
                            <Text style={styles.buttonText}>パスワードを変更</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    placeholder: {
        width: 32,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
    card: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    currentValue: {
        fontSize: 16,
        color: '#666',
        paddingVertical: 12,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default LoginInfoScreen;
