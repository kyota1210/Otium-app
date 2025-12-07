import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, Text, ScrollView } from 'react-native';
import { useRecordsApi } from '../api/records';

export default function CreateRecordScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dateLogged, setDateLogged] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD形式
    const [loading, setLoading] = useState(false);

    const { createRecord } = useRecordsApi();

    const handleCreate = async () => {
        if (!title || !dateLogged) {
            Alert.alert('エラー', 'タイトルと日付は必須です。');
            return;
        }

        setLoading(true);
        try {
            await createRecord({ 
                title, 
                description, 
                date_logged: dateLogged, // APIのキー名と合わせる
                // photo_url は省略
            });
            
            Alert.alert('成功', '新しい記録が追加されました。');
            
            // 記録一覧画面に戻り、一覧をリフレッシュさせる
            navigation.goBack(); 
        } catch (error) {
            Alert.alert('作成失敗', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>タイトル (必須)</Text>
            <TextInput
                style={styles.input}
                placeholder="例: ランニング 5km"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>日付 (必須)</Text>
            <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={dateLogged}
                onChangeText={setDateLogged}
            />

            <Text style={styles.label}>詳細</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="今日の感想、特別な出来事など..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
            />
            
            {/* 写真URLの入力欄はここでは省略します */}

            <Button
                title={loading ? "作成中..." : "記録を作成"}
                onPress={handleCreate}
                disabled={loading}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    }
});