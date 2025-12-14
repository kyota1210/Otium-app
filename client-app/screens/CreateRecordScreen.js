import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRecordsApi } from '../api/records';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function CreateRecordScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dateLogged, setDateLogged] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD形式
    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(false);

    const { createRecord } = useRecordsApi();

    // 画像を選択する関数
    const pickImage = async () => {
        // 権限リクエスト
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('権限エラー', '画像をアップロードするにはカメラロールへのアクセス許可が必要です。');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3], // アスペクト比
            quality: 0.8,   // 画質 (0.0 - 1.0)
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

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
                date_logged: dateLogged, 
                imageUri // 選択された画像のURIを渡す
            });
            
            Alert.alert('成功', '新しい記録が追加されました。');
            
            // 入力欄をクリア
            setTitle('');
            setDescription('');
            setImageUri(null);
            
            // 記録一覧画面に戻る
            navigation.goBack(); 
        } catch (error) {
            Alert.alert('作成失敗', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* 画像選択エリア */}
            <View style={styles.imageSection}>
                <Text style={styles.label}>写真</Text>
                {imageUri ? (
                    <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                        <TouchableOpacity 
                            style={styles.removeImageButton} 
                            onPress={() => setImageUri(null)}
                        >
                            <Ionicons name="close-circle" size={24} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.imageSelectButton} onPress={pickImage}>
                        <Ionicons name="camera-outline" size={32} color="#007AFF" />
                        <Text style={styles.imageSelectText}>写真を選択</Text>
                    </TouchableOpacity>
                )}
            </View>

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
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    imageSection: {
        marginBottom: 20,
    },
    imageSelectButton: {
        width: '100%',
        height: 150,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    imageSelectText: {
        marginTop: 8,
        color: '#007AFF',
        fontSize: 16,
    },
    imagePreviewContainer: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
    }
});
