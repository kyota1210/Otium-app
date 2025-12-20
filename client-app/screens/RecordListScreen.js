import React, { useState, useCallback, useContext, useRef } from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRecordsApi } from '../api/records';
import { fetchCategories } from '../api/categories';
import { useFocusEffect } from '@react-navigation/native';
import { getImageUrl } from '../utils/imageHelper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SERVER_URL } from '../config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = SCREEN_WIDTH / 3; // 3列

// 日付を "2024 October" 形式にフォーマットするヘルパー
const formatFloatingDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'long' });
    return `${year} ${month}`;
};

// ギャラリーアイテムコンポーネント
const GalleryItem = ({ item, navigation, itemWidth, aspectRatio }) => {
    const imageUrl = getImageUrl(item.image_url);

    return (
        <TouchableOpacity 
            style={[styles.galleryCard, { width: itemWidth }]} 
            onPress={() => navigation.navigate('RecordDetail', { record: item })}
            activeOpacity={0.9}
        >
            <View style={[styles.imageContainer, { aspectRatio }]}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.galleryImage} />
                ) : (
                    <View style={styles.placeholderGalleryImage}>
                        <Ionicons name="image" size={20} color="#fff" />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default function RecordListScreen({ navigation }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);
    const [currentDateLabel, setCurrentDateLabel] = useState('');
    const [showDateLabel, setShowDateLabel] = useState(false);
    
    const { fetchRecords } = useRecordsApi();
    const { userInfo, userToken } = useContext(AuthContext);
    const { theme } = useTheme();
    const scrollTimeout = useRef(null);

    // カテゴリーを取得する関数
    const loadCategories = useCallback(async () => {
        try {
            const fetchedCategories = await fetchCategories(userToken);
            if (fetchedCategories.length > 0) {
                const allCategory = { id: 'all', name: 'All', icon: 'apps', color: theme.colors.primary };
                const newCategories = [allCategory, ...fetchedCategories];
                setCategories(newCategories);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error('カテゴリー取得エラー:', error);
            setCategories([]);
        }
    }, [userToken, theme.colors.primary]);

    // 記録を取得する関数
    const loadRecords = useCallback(async () => {
        setLoading(true);
        try {
            const categoryId = selectedCategory === 'all' ? null : selectedCategory;
            const data = await fetchRecords(categoryId);
            setRecords(data);
            if (data.length > 0) {
                setCurrentDateLabel(formatFloatingDate(data[0].date_logged));
            }
        } catch (error) {
            Alert.alert('エラー', '記録の取得に失敗しました: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, [fetchRecords, selectedCategory]);

    const renderPackedGrid = () => {
        const rows = [];
        let i = 0;
        const patterns = [
            [100],               // 1枚 (100%)
            [50, 50],            // 2枚 (50%ずつ)
            [66.6, 33.3],        // 2枚 (大・小)
            [33.3, 66.6],        // 2枚 (小・大)
            [33.3, 33.3, 33.3],  // 3枚 (33%ずつ)
        ];

        while (i < records.length) {
            // IDをシードにしてパターンを決定
            const patternIndex = (records[i].id) % patterns.length;
            const pattern = patterns[patternIndex];
            const rowItems = records.slice(i, i + pattern.length);
            
            if (rowItems.length > 0) {
                // その行のベースとなるアスペクト比を決定
                const rowAspectRatio = 1 + ((records[i].id % 5) / 10); // 1.0 〜 1.4 の間で変動

                rows.push(
                    <View key={`row-${i}`} style={styles.rowContainer}>
                        {rowItems.map((item, index) => {
                            const widthPercent = pattern[index] || (100 / rowItems.length);
                            // 行内で高さを揃えるため、アスペクト比を幅に合わせて調整
                            const itemAspectRatio = rowAspectRatio * (widthPercent / 100) * rowItems.length;
                            
                            return (
                                <GalleryItem 
                                    key={item.id} 
                                    item={item} 
                                    navigation={navigation} 
                                    itemWidth={`${widthPercent}%`}
                                    aspectRatio={itemAspectRatio}
                                />
                            );
                        })}
                    </View>
                );
            }
            i += pattern.length;
        }
        return rows;
    };

    // スクロール時の処理
    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        
        // 日付ラベルを表示
        setShowDateLabel(true);
        
        // スクロール停止を検知してラベルを隠す
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            setShowDateLabel(false);
        }, 1500);

        // 現在表示されているアイテムから日付を推定（簡易版）
        const itemIndex = Math.floor(offsetY / 200); // 概算のアイテム高さ
        const targetItem = records[itemIndex * 2]; // 2列なので
        if (targetItem) {
            const label = formatFloatingDate(targetItem.date_logged);
            if (label !== currentDateLabel) {
                setCurrentDateLabel(label);
            }
        }
    };

    // 画面が表示されるたびにデータを再取得
    useFocusEffect(
        useCallback(() => {
            loadCategories();
            loadRecords();
        }, [loadCategories, loadRecords])
    );
    
    // カテゴリー変更時に記録を再取得
    React.useEffect(() => {
        if (categories.length > 0) {
            loadRecords();
        }
    }, [selectedCategory]);

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    // データを3カラムに分割
    const leftColumnData = records.filter((_, i) => i % 3 === 0);
    const midColumnData = records.filter((_, i) => i % 3 === 1);
    const rightColumnData = records.filter((_, i) => i % 3 === 2);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            {/* トップナビゲーションバー */}
            <View style={[styles.topNavBar, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.appName, { color: theme.colors.text }]}>Otium</Text>
                <View style={styles.iconButtons}>
                    <TouchableOpacity 
                        style={styles.insightButton}
                        onPress={() => navigation.navigate('Insight')}
                    >
                        <Ionicons name="analytics-outline" size={24} color={theme.colors.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Ionicons name="notifications-outline" size={24} color={theme.colors.icon} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ユーザー情報ヘッダー */}
            <View style={[styles.userHeader, { 
                backgroundColor: theme.colors.background,
                borderBottomColor: theme.colors.border 
            }]}>
                <TouchableOpacity 
                    style={[styles.userIconContainer, { backgroundColor: theme.colors.secondaryBackground }]}
                    onPress={() => navigation.navigate('ProfileEdit')}
                    activeOpacity={0.7}
                >
                    {userInfo?.avatar_url ? (
                        <Image 
                            source={{ uri: `${SERVER_URL}/${userInfo.avatar_url}` }} 
                            style={styles.userAvatar}
                        />
                    ) : (
                        <Ionicons name="person-circle-outline" size={70} color={theme.colors.icon} />
                    )}
                </TouchableOpacity>
                <View style={styles.userInfoText}>
                    <Text style={[styles.userNameText, { color: theme.colors.text }]}>
                        {userInfo?.user_name || 'ゲスト'}
                    </Text>
                    <Text style={[styles.totalArchives, { color: theme.colors.inactive }]}>
                        Total Archives: {records.length}
                    </Text>
                </View>
                
                {categories.length > 0 && (
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoryScrollContainer}
                        contentContainerStyle={[
                            styles.categoryScrollContent,
                            categories.length === 2 && styles.categoryScrollContentRightAlign
                        ]}
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
                                    selectedCategory === category.id && styles.categoryIconCircleSelected,
                                    { 
                                        backgroundColor: category.color ? `${category.color}20` : theme.colors.secondaryBackground,
                                        borderColor: selectedCategory === category.id ? (category.color || theme.colors.primary) : 'transparent'
                                    }
                                ]}>
                                    <Ionicons 
                                        name={category.icon} 
                                        size={20} 
                                        color={category.color || theme.colors.secondaryText} 
                                    />
                                </View>
                                <Text style={[
                                    styles.categoryName,
                                    { color: theme.colors.secondaryText },
                                    selectedCategory === category.id && [styles.categoryNameSelected, { color: theme.colors.text }]
                                ]}>
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>

            <View style={styles.mainContent}>
                <ScrollView 
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={styles.scrollContent}
                >
                    {records.length > 0 ? (
                        <View style={styles.gridContainer}>
                            {renderPackedGrid()}
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="document-text-outline" size={64} color={theme.colors.border} />
                            <Text style={[styles.emptyText, { color: theme.colors.border }]}>まだ記録がありません。</Text>
                            <Text style={[styles.emptySubText, { color: theme.colors.inactive }]}>
                                下の「作成」タブから新しい記録を追加しましょう。
                            </Text>
                        </View>
                    )}
                </ScrollView>

                {/* フローティング日付インジケーター */}
                {showDateLabel && currentDateLabel !== '' && (
                    <View style={styles.floatingDateContainer}>
                        <Text style={[styles.floatingDateText, { 
                            color: theme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' 
                        }]}>
                            {currentDateLabel}
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
    },
    topNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 2,
        paddingBottom: 0,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
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
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 6,
        borderBottomWidth: 1,
    },
    userIconContainer: {
        marginRight: 12,
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    userInfoText: {
        flex: 0,
        marginRight: 8,
    },
    userNameText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalArchives: {
        fontSize: 12,
    },
    categoryScrollContainer: {
        flex: 1,
        maxHeight: 80,
    },
    categoryScrollContent: {
        alignItems: 'center',
        flexGrow: 1,
    },
    categoryScrollContentRightAlign: {
        justifyContent: 'flex-end',
    },
    categoryItem: {
        alignItems: 'center',
        marginHorizontal: 8,
    },
    categoryIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    categoryIconCircleSelected: {
        // 選択時のスタイル
    },
    categoryName: {
        fontSize: 10,
        marginTop: 4,
    },
    categoryNameSelected: {
        fontWeight: 'bold',
    },
    mainContent: {
        flex: 1,
        position: 'relative',
    },
    scrollContent: {
        padding: 0,
    },
    gridContainer: {
        width: '100%',
    },
    rowContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    galleryCard: {
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: '#fff',
    },
    imageContainer: {
        width: '100%',
        backgroundColor: '#fdfdfd',
        // 余白なし
        padding: 0,
    },
    galleryImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 0, // 角丸なし
    },
    placeholderGalleryImage: {
        width: '100%',
        height: 150,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    galleryInfo: {
        paddingTop: 8,
        paddingHorizontal: 4,
    },
    galleryTitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#444',
        letterSpacing: 0.5,
    },
    galleryDate: {
        fontSize: 9,
        color: '#aaa',
        marginTop: 2,
        fontFamily: 'serif', // 高級感を出すためにセリフ体（利用可能な場合）
    },
    floatingDateContainer: {
        position: 'absolute',
        bottom: 40, // 下部に配置
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000,
    },
    floatingDateText: {
        fontSize: 14,
        fontWeight: '300',
        letterSpacing: 4,
        textTransform: 'uppercase',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
});
