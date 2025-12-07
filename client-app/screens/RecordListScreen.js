// AppStackのメイン画面
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRecordsApi } from '../api/records';
import { useFocusEffect } from '@react-navigation/native';

export default function RecordListScreen({ navigation }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const { fetchRecords } = useRecordsApi();

    // 記録を取得する関数
    const loadRecords = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchRecords();
            setRecords(data);
        } catch (error) {
            Alert.alert('エラー', '記録の取得に失敗しました: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, [fetchRecords]);

    // 画面が表示されるたびにデータを再取得
    useFocusEffect(
        useCallback(() => {
            loadRecords();
        }, [loadRecords])
    );
    
    // 記録削除の処理
    const handleDelete = async (id) => {
        Alert.alert(
            "削除確認",
            "この記録を本当に削除しますか？",
            [
                { text: "キャンセル" },
                { 
                    text: "削除", 
                    onPress: async () => {
                        try {
                            await deleteRecord(id);
                            loadRecords(); 
                        } catch (error) {
                            Alert.alert('削除失敗', error.message);
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={records}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    const date = new Date(item.date_logged);
                    const year = date.getFullYear(); // 西暦
                    const monthDay = `${date.getMonth() + 1}/${date.getDate()}`; // 月日

                    return (
                        <TouchableOpacity 
                            style={styles.card} 
                            onPress={() => navigation.navigate('RecordDetail', { record: item })}
                        >
                            {/* 左半分: 画像 */}
                            <View style={styles.leftContainer}>
                                {item.image_url ? (
                                    <Image source={{ uri: item.image_url }} style={styles.image} />
                                ) : (
                                    <View style={styles.placeholderImage}>
                                        <Ionicons name="image" size={32} color="#fff" />
                                    </View>
                                )}
                            </View>

                            {/* 右半分: 情報 */}
                            <View style={styles.rightContainer}>
                                <View style={styles.dateHeader}>
                                    <Text style={styles.monthDay}>{monthDay}</Text>
                                </View>
                                
                                <View style={styles.textContainer}>
                                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                                </View>

                                <View style={styles.yearContainer}>
                                    <Text style={styles.year}>{year}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>まだ記録がありません。</Text>
                        <Text style={styles.emptySubText}>下の「作成」タブから新しい記録を追加しましょう。</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5', // 背景色を少しグレーに
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row', // 横並びにする
        height: 120, // 固定高さ（必要に応じて調整）
        overflow: 'hidden',
        // シャドウ
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    // 左側（画像エリア）
    leftContainer: {
        flex: 1, // 1:1 の比率
        backgroundColor: '#ddd',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderImage: {
        flex: 1,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // 右側（テキストエリア）
    rightContainer: {
        flex: 1, // 1:1 の比率
        padding: 10,
        position: 'relative', // 年を右下に配置するために必要
    },
    dateHeader: {
        alignItems: 'flex-end', // 右寄せ
        marginBottom: 4,
    },
    monthDay: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    yearContainer: {
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    year: {
        fontSize: 12,
        color: '#999',
    },
    // Empty State styles...
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#888',
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: '#aaa',
        marginTop: 8,
    }
});