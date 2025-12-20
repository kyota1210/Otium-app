import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { authContext } = useContext(AuthContext);
    const { theme } = useTheme();
    const { t } = useLanguage();

    const handleSignup = async () => {
        if (!email || !password) {
            Alert.alert(t('error'), t('emailPasswordRequired'));
            return;
        }
        setLoading(true);

        const result = await authContext.signUp(email, displayName, password);

        if (result.success) {
            Alert.alert(t('signupLoginSuccess'), t('redirectToMain'));
            // 成功した場合、AppNavigatorが自動で画面を切り替えます
        } else {
             Alert.alert(t('signupFailed'), result.error);
        }

        setLoading(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.secondaryBackground }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
                {t('newUserRegistration')}
            </Text>
            
            <TextInput 
                style={[styles.input, {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                }]}
                placeholder={t('emailAddress')} 
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
                placeholder={t('displayNameOptional')} 
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
                placeholder={t('password')} 
                placeholderTextColor={theme.colors.inactive}
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry
            />

            <Button 
                title={loading ? t('signingUp') : t('signUp')} 
                onPress={handleSignup} 
                disabled={loading} 
                color={theme.colors.primary}
            />

            <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
                <Text style={[styles.backText, { color: theme.colors.primary }]}>
                    {t('backToLogin')}
                </Text>
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
