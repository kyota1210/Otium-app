import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { authContext } = useContext(AuthContext);
    const { theme } = useTheme();

    const handleSignup = async () => {
        if (!email || !password) {
            Alert.alert('エラー', 'メールアドレスとパスワードは必須です。');
            return;
        }
        setLoading(true);

        const result = await authContext.signUp(email, displayName, password);

        if (result.success) {
            Alert.alert('登録・ログイン成功', 'メイン画面へ移動します。');
            // 成功した場合、AppNavigatorが自動で画面を切り替えます
        } else {
             Alert.alert('登録失敗', result.error);
        }

        setLoading(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.secondaryBackground }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>新規ユーザー登録</Text>
            
            <TextInput 
                style={[styles.input, {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                }]}
                placeholder="メールアドレス" 
                placeholderTextColor={theme.colors.inactive}
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address" 
                autoCapitalize="none"
            />
            <TextInput 
                style={[styles.input, {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                }]}
                placeholder="表示名（オプション）" 
                placeholderTextColor={theme.colors.inactive}
                value={displayName} 
                onChangeText={setDisplayName}
            />
            <TextInput 
                style={[styles.input, {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                }]}
                placeholder="パスワード" 
                placeholderTextColor={theme.colors.inactive}
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry
            />

            <Button title={loading ? "登録中..." : "サインアップ"} onPress={handleSignup} disabled={loading} color={theme.colors.primary}/>

            <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
                <Text style={[styles.backText, { color: theme.colors.primary }]}>ログイン画面に戻る</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    backLink: {
        marginTop: 20,
    },
    backText: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
