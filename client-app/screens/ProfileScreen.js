import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = () => {
    const { logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>マイページ</Text>
            <Text style={styles.subText}>ユーザー設定やログアウトはこちら</Text>
            
            <View style={styles.buttonContainer}>
                <Button title="ログアウト" onPress={logout} color="#FF3B30" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    buttonContainer: {
        width: '80%',
    }
});

export default ProfileScreen;

