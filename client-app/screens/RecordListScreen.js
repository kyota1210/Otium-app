// AppStackのメイン画面
import React, { useState, useCallback, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRecordsApi } from '../api/records';
import { useFocusEffect } from '@react-navigation/native';
import { getImageUrl } from '../utils/imageHelper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { SERVER_URL } from '../config';

export default function RecordListScreen({ navigation }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { fetchRecords } = useRecordsApi();
    const { userInfo } = useContext(AuthContext);

    // カテゴリーのダミーデータ（後でAPIから取得）
    const categories = [
        { id: 'all', name: 'All', icon: 'apps' },
        { id: 'cafe', name: 'Café', icon: 'cafe' },
        { id: 'film', name: 'Film', icon: 'film' },
        { id: 'daily', name: 'Daily', icon: 'calendar' },
        { id: 'travel', name: 'Travel', icon: 'airplane' },
    ];

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
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* トップナビゲーションバー */}
            <View style={styles.topNavBar}>
                <Text style={styles.appName}>Otium</Text>
                <View style={styles.iconButtons}>
                    <TouchableOpacity 
                        style={styles.insightButton}
                        onPress={() => navigation.navigate('Insight')}
                    >
                        <Ionicons name="analytics-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Ionicons name="notifications-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ユーザー情報ヘッダー */}
            <View style={styles.userHeader}>
                <TouchableOpacity 
                    style={styles.userIconContainer}
                    onPress={() => navigation.navigate('ProfileEdit')}
                    activeOpacity={0.7}
                >
                    {userInfo?.avatar_url ? (
                        <Image 
                            source={{ uri: `${SERVER_URL}/${userInfo.avatar_url}` }} 
                            style={styles.userAvatar}
                        />
                    ) : (
                        <Ionicons name="person-circle-outline" size={70} color="#333" />
                    )}
                </TouchableOpacity>
                <View style={styles.userInfoText}>
                    <Text style={styles.userNameText}>{userInfo?.user_name || 'ゲスト'}</Text>
                    <Text style={styles.totalArchives}>Total Archives: {records.length}</Text>
                </View>
                
                {/* カテゴリースクロールエリア */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryScrollContainer}
                    contentContainerStyle={styles.categoryScrollContent}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryItem,
                                selectedCategory === category.id && styles.categoryItemSelected
                            ]}
                            onPress={() => setSelectedCategory(category.id)}
                        >
                            <View style={[
                                styles.categoryIconCircle,
                                selectedCategory === category.id && styles.categoryIconCircleSelected
                            ]}>
                                <Ionicons 
                                    name={category.icon} 
                                    size={20} 
                                    color={selectedCategory === category.id ? '#007AFF' : '#666'} 
                                />
                            </View>
                            <Text style={[
                                styles.categoryName,
                                selectedCategory === category.id && styles.categoryNameSelected
                            ]}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={records}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                style={styles.listContainer}
                renderItem={({ item }) => {
                    const date = new Date(item.date_logged);
                    const year = date.getFullYear(); // 西暦
                    const monthDay = `${date.getMonth() + 1}/${date.getDate()}`; // 月日
                    
                    const imageUrl = getImageUrl(item.image_url);

                    return (
                        <TouchableOpacity 
                            style={styles.card} 
                            onPress={() => navigation.navigate('RecordDetail', { record: item })}
                        >
                            {/* 左半分: 画像 */}
                            <View style={styles.leftContainer}>
                                {imageUrl ? (
                                    <Image source={{ uri: imageUrl }} style={styles.image} />
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff',
    },
    topNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 2,
        paddingBottom: 0,
        backgroundColor: '#fff',
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    iconButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    insightButton: {
        padding: 4,
        marginRight: 12,
    },
    notificationButton: {
        padding: 4,
    },
    userHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingTop: 4,
        paddingBottom: 6,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    userIconContainer: {
        marginLeft: 6,
        marginRight: 8,
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userAvatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    userInfoText: {
        flex: 0,
        marginRight: 8,
    },
    userNameText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        marginBottom: 2,
    },
    totalArchives: {
        fontSize: 11,
        color: '#888',
        marginTop: 1,
    },
    categoryScrollContainer: {
        flex: 1,
        maxHeight: 90,
    },
    categoryScrollContent: {
        alignItems: 'center',
        paddingRight: 6,
    },
    categoryItem: {
        alignItems: 'center',
        marginHorizontal: 6,
    },
    categoryIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    categoryIconCircleSelected: {
        borderColor: '#007AFF',
        backgroundColor: '#E8F4FF',
    },
    categoryName: {
        fontSize: 10,
        color: '#666',
        marginTop: 4,
        textAlign: 'center',
    },
    categoryNameSelected: {
        color: '#007AFF',
        fontWeight: '600',
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    listContainer: {
        backgroundColor: '#f5f5f5',
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
