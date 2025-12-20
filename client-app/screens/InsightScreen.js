import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecordsApi } from '../api/records';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const InsightScreen = ({ navigation }) => {
    const { authContext, userInfo } = useContext(AuthContext);
    const { fetchRecords } = useRecordsApi();
    const [records, setRecords] = useState([]);
    const [stats, setStats] = useState({
        totalRecords: 0,
        thisMonth: 0,
        thisWeek: 0,
        categoriesCount: 0,
    });

    // 記録を取得して統計を計算
    const loadInsights = useCallback(async () => {
        try {
            const data = await fetchRecords();
            setRecords(data);
            
            // 統計を計算
            const now = new Date();
            const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const thisWeekStart = new Date(now);
            thisWeekStart.setDate(now.getDate() - 7);
            
            const thisMonthRecords = data.filter(r => new Date(r.date_logged) >= thisMonthStart);
            const thisWeekRecords = data.filter(r => new Date(r.date_logged) >= thisWeekStart);
            
            setStats({
                totalRecords: data.length,
                thisMonth: thisMonthRecords.length,
                thisWeek: thisWeekRecords.length,
                categoriesCount: 5, // ダミー値、後でカテゴリAPIから取得
            });
        } catch (error) {
            console.error('Failed to load insights:', error);
        }
    }, [fetchRecords]);

    useFocusEffect(
        useCallback(() => {
            loadInsights();
        }, [loadInsights])
    );

    const handleLogout = () => {
        Alert.alert(
            'ログアウト',
            'ログアウトしますか？',
            [
                {
                    text: 'キャンセル',
                    style: 'cancel',
                },
                {
                    text: 'ログアウト',
                    style: 'destructive',
                    onPress: async () => {
                        await authContext.signOut();
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* トップナビゲーションバー */}
            <View style={styles.topNavBar}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Insight</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* 統計カードグリッド */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={[styles.statIconContainer, { backgroundColor: '#E8F4FF' }]}>
                            <Ionicons name="albums" size={24} color="#007AFF" />
                        </View>
                        <Text style={styles.statValue}>{stats.totalRecords}</Text>
                        <Text style={styles.statLabel}>総記録数</Text>
                    </View>
                    
                    <View style={styles.statCard}>
                        <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                            <Ionicons name="calendar" size={24} color="#FF9800" />
                        </View>
                        <Text style={styles.statValue}>{stats.thisMonth}</Text>
                        <Text style={styles.statLabel}>今月</Text>
                    </View>
                    
                    <View style={styles.statCard}>
                        <View style={[styles.statIconContainer, { backgroundColor: '#F3E5F5' }]}>
                            <Ionicons name="time" size={24} color="#9C27B0" />
                        </View>
                        <Text style={styles.statValue}>{stats.thisWeek}</Text>
                        <Text style={styles.statLabel}>今週</Text>
                    </View>
                    
                    <View style={styles.statCard}>
                        <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="grid" size={24} color="#4CAF50" />
                        </View>
                        <Text style={styles.statValue}>{stats.categoriesCount}</Text>
                        <Text style={styles.statLabel}>カテゴリ</Text>
                    </View>
                </View>

                {/* アクティビティサマリー */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="trending-up" size={20} color="#007AFF" />
                        <Text style={styles.sectionTitle}>アクティビティ</Text>
                    </View>
                    <View style={styles.activityCard}>
                        <View style={styles.activityRow}>
                            <View style={styles.activityDot} />
                            <Text style={styles.activityText}>
                                平均 <Text style={styles.activityValue}>{stats.totalRecords > 0 ? Math.round(stats.totalRecords / 12) : 0}</Text> 件/月
                            </Text>
                        </View>
                        <View style={styles.activityRow}>
                            <View style={styles.activityDot} />
                            <Text style={styles.activityText}>
                                最長ストリーク <Text style={styles.activityValue}>7</Text> 日
                            </Text>
                        </View>
                        <View style={styles.activityRow}>
                            <View style={styles.activityDot} />
                            <Text style={styles.activityText}>
                                お気に入りの時間帯 <Text style={styles.activityValue}>午後</Text>
                            </Text>
                        </View>
                    </View>
                </View>

                {/* カテゴリ分析 */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="pie-chart" size={20} color="#007AFF" />
                        <Text style={styles.sectionTitle}>カテゴリ別記録</Text>
                    </View>
                    <View style={styles.categoryCard}>
                        <CategoryBar label="Café" count={Math.round(stats.totalRecords * 0.3)} total={stats.totalRecords} color="#FF6B6B" icon="cafe" />
                        <CategoryBar label="Film" count={Math.round(stats.totalRecords * 0.25)} total={stats.totalRecords} color="#4ECDC4" icon="film" />
                        <CategoryBar label="Daily" count={Math.round(stats.totalRecords * 0.2)} total={stats.totalRecords} color="#FFD93D" icon="calendar" />
                        <CategoryBar label="Travel" count={Math.round(stats.totalRecords * 0.15)} total={stats.totalRecords} color="#95E1D3" icon="airplane" />
                        <CategoryBar label="Other" count={Math.round(stats.totalRecords * 0.1)} total={stats.totalRecords} color="#C7CEEA" icon="ellipsis-horizontal" />
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

// カテゴリバーコンポーネント
const CategoryBar = ({ label, count, total, color, icon }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
        <View style={styles.categoryBarContainer}>
            <View style={styles.categoryBarHeader}>
                <View style={styles.categoryBarLabel}>
                    <Ionicons name={icon} size={16} color={color} />
                    <Text style={styles.categoryBarText}>{label}</Text>
                </View>
                <Text style={styles.categoryBarCount}>{count}</Text>
            </View>
            <View style={styles.categoryBarTrack}>
                <View 
                    style={[
                        styles.categoryBarFill, 
                        { width: `${percentage}%`, backgroundColor: color }
                    ]} 
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    topNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        padding: 4,
        width: 32,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    placeholder: {
        width: 32,
    },
    scrollView: {
        flex: 1,
    },
    // 統計グリッド
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        paddingTop: 16,
        marginBottom: 12,
        justifyContent: 'space-between',
    },
    statCard: {
        width: (width - 36) / 2,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    // セクション
    section: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    // アクティビティカード
    activityCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#007AFF',
        marginRight: 12,
    },
    activityText: {
        fontSize: 15,
        color: '#666',
    },
    activityValue: {
        fontWeight: 'bold',
        color: '#333',
    },
    // カテゴリカード
    categoryCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    categoryBarContainer: {
        marginBottom: 16,
    },
    categoryBarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryBarLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryBarText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        marginLeft: 8,
    },
    categoryBarCount: {
        fontSize: 14,
        color: '#666',
        fontWeight: 'bold',
    },
    categoryBarTrack: {
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    categoryBarFill: {
        height: '100%',
        borderRadius: 4,
    },
});

export default InsightScreen;
