// AppStackのメイン画面
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Button, Alert, ActivityIndicator } from 'react-native';
import { useRecordsApi } from '../api/records';
import { useFocusEffect } from '@react-navigation/native';

export default function RecordListScreen({ navigation }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const { fetchRecords, deleteRecord } = useRecordsApi();

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

    // 画面が表示されるたびにデータを再取得 (新しい記録が作成された場合など)
    useFocusEffect(
        useCallback(() => {
            loadRecords();
            // クリーンアップ関数は特に必要ない
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
                            // 削除成功後、一覧を更新
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
        return <View style={styles.center}><ActivityIndicator size="large" /></View>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={records}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.recordItem}>
                        <View>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text>{item.date_logged} | {item.description}</Text>
                        </View>
                        <Button title="削除" onPress={() => handleDelete(item.id)} color="red" />
                    </View>
                )}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>まだ記録がありません。右上のボタンから作成しましょう。</Text>
                )}
            />
            
            {/* 記録作成画面への遷移ボタン */}
            <View style={styles.addButton}>
                <Button 
                    title="記録を追加" 
                    onPress={() => navigation.navigate('CreateRecord')} 
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    recordItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#888'
    },
    addButton: {
        padding: 10,
    }
});