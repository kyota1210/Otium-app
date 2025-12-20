import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginInfoScreen = ({ navigation }) => {
    const { userInfo } = useContext(AuthContext);
    const { theme } = useTheme();
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
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            {/* トップナビゲーションバー */}
            <View style={[styles.topNavBar, {
                backgroundColor: theme.colors.background,
                borderBottomColor: theme.colors.border
            }]}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.icon} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>ログイン情報の変更</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={[styles.scrollView, { backgroundColor: theme.colors.secondaryBackground }]}>
                {/* メールアドレス変更 */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.secondaryText }]}>メールアドレス</Text>
                    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.colors.text }]}>現在のメールアドレス</Text>
                            <Text style={[styles.currentValue, { color: theme.colors.secondaryText }]}>
                                {userInfo?.email || ''}
                            </Text>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.colors.text }]}>新しいメールアドレス</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.colors.secondaryBackground,
                                    borderColor: theme.colors.border,
                                    color: theme.colors.text
                                }]}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="新しいメールアドレスを入力"
                                placeholderTextColor={theme.colors.inactive}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <TouchableOpacity 
                            style={[styles.button, { backgroundColor: theme.colors.primary }]}
                            onPress={handleUpdateEmail}
                        >
                            <Text style={styles.buttonText}>メールアドレスを変更</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* パスワード変更 */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.secondaryText }]}>パスワード</Text>
                    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.colors.text }]}>現在のパスワード</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.colors.secondaryBackground,
                                    borderColor: theme.colors.border,
                                    color: theme.colors.text
                                }]}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                placeholder="現在のパスワードを入力"
                                placeholderTextColor={theme.colors.inactive}
                                secureTextEntry
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.colors.text }]}>新しいパスワード</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.colors.secondaryBackground,
                                    borderColor: theme.colors.border,
                                    color: theme.colors.text
                                }]}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="新しいパスワードを入力"
                                placeholderTextColor={theme.colors.inactive}
                                secureTextEntry
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.colors.text }]}>新しいパスワード（確認）</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.colors.secondaryBackground,
                                    borderColor: theme.colors.border,
                                    color: theme.colors.text
                                }]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="新しいパスワードを再入力"
                                placeholderTextColor={theme.colors.inactive}
                                secureTextEntry
                            />
                        </View>
                        <TouchableOpacity 
                            style={[styles.button, { backgroundColor: theme.colors.primary }]}
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
    },
    topNavBar: {
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 32,
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
        paddingBottom: 12,
    },
    card: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    currentValue: {
        fontSize: 16,
        paddingVertical: 12,
    },
    input: {
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
    },
    button: {
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
