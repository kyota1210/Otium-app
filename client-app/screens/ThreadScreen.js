import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ThreadScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>スレッド</Text>
            <Text style={styles.subText}>ここにはスレッド一覧が表示されます</Text>
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
    },
});

export default ThreadScreen;

