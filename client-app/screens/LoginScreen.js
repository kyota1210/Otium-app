import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { authContext } = useContext(AuthContext);

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
        <View style={styles.container}>
            <Text style={styles.title}>ログイン</Text>
            
            <TextInput style={styles.input} placeholder="メールアドレス" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
            <TextInput style={styles.input} placeholder="パスワード" value={password} onChangeText={setPassword} secureTextEntry/>

            <Button title={loading ? "ログイン中..." : "ログイン"} onPress={handleLogin} disabled={loading}/>

            <TouchableOpacity style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupText}>新規登録はこちら</Text>
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
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    signupLink: {
        marginTop: 20,
    },
    signupText: {
        color: '#007AFF',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});