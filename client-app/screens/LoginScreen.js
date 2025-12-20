import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { authContext } = useContext(AuthContext);
    const { theme } = useTheme();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('エラー', 'メールアドレスとパスワードを入力してください。');
            return;
        }
        setLoading(true);
        
        const result = await authContext.signIn(email, password);
        if (!result.success) {
            Alert.alert('ログイン失敗', result.error);
        }
        // 成功した場合、AppNavigatorが自動で画面を切り替えます
        setLoading(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.secondaryBackground }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>ログイン</Text>
            
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
                placeholder="パスワード" 
                placeholderTextColor={theme.colors.inactive}
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry
            />

            <Button title={loading ? "ログイン中..." : "ログイン"} onPress={handleLogin} disabled={loading} color={theme.colors.primary}/>

            <TouchableOpacity style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>
                <Text style={[styles.signupText, { color: theme.colors.primary }]}>新規登録はこちら</Text>
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
    signupLink: {
        marginTop: 20,
    },
    signupText: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});