import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRecordsApi } from '../api/records';

export default function RecordDetailScreen({ route, navigation }) {
    const { record } = route.params;
    const { deleteRecord } = useRecordsApi();

    const handleDelete = () => {
        Alert.alert(
            "削除確認",
            "この記録を本当に削除しますか？",
            [
                { text: "キャンセル" },
                {
                    text: "削除",
                    onPress: async () => {
                        try {
                            await deleteRecord(record.id);
                            navigation.goBack(); // 削除後に前の画面に戻る
                        } catch (error) {
                            Alert.alert('削除失敗', error.message);
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const handleEdit = () => {
        // ここに編集画面への遷移処理などを記述
        Alert.alert("通知", "編集ボタンが押されました");
    };

    // 日付の表示形式を調整
    const date = new Date(record.date_logged);
    const dateString = date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* 画像があれば表示、なければプレースホルダー */}
                <View style={styles.imageContainer}>
                    {record.image_url ? (
                        <Image source={{ uri: record.image_url }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Ionicons name="image-outline" size={80} color="#ccc" />
                            <Text style={styles.placeholderText}>No Image</Text>
                        </View>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.date}>{dateString}</Text>
                    <Text style={styles.title}>{record.title}</Text>
                    {record.description && <Text style={styles.description}>{record.description}</Text>}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerButton} onPress={handleEdit}>
                    <Ionicons name="create-outline" size={24} color="#007AFF" />
                    <Text style={styles.footerButtonText}>編集</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { paddingBottom: 80 },
    imageContainer: {
        width: '100%',
        height: 250,
        backgroundColor: '#f0f0f0',
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    placeholderImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e1e1e1',
    },
    placeholderText: { color: '#999', marginTop: 10 },
    infoContainer: { padding: 20 },
    date: { fontSize: 14, color: '#666', marginBottom: 8 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 16 },
    description: { fontSize: 16, color: '#444', lineHeight: 24 },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingBottom: 20, // iPhoneの下部バー領域用
    },
    footerButton: { flexDirection: 'row', alignItems: 'center' },
    footerButtonText: { marginLeft: 8, fontSize: 16, color: '#007AFF' },
    deleteButton: { padding: 10 },
});
