import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecordsApi } from '../api/records';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const InsightScreen = ({ navigation }) => {
    const { authContext, userInfo } = useContext(AuthContext);
    const { theme } = useTheme();
    const { t } = useLanguage();
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
                categoriesCount: 5, // ダミー値、後でカテゴリーAPIから取得
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
            t('logout'),
            t('logoutConfirm'),
            [
                {
                    text: t('cancel'),
                    style: 'cancel',
                },
                {
                    text: t('logout'),
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
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            {/* トップナビゲーションバー */}
            <View style={[styles.topNavBar, { 
                backgroundColor: theme.colors.background,
                borderBottomColor: theme.colors.border 
            }]}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.icon} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    {t('insights')}
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView 
                style={[styles.scrollView, { backgroundColor: theme.colors.secondaryBackground }]} 
                showsVerticalScrollIndicator={false}
            >
                {/* 統計カードグリッド */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
                        <View style={[styles.statIconContainer, { 
                            backgroundColor: theme.isDark ? '#1a3a5c' : '#E8F4FF' 
                        }]}>
                            <Ionicons name="albums" size={24} color={theme.colors.primary} />
                        </View>
                        <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats.totalRecords}</Text>
                        <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
                            {t('totalRecords')}
                        </Text>
                    </View>
                    
                    <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
                        <View style={[styles.statIconContainer, { 
                            backgroundColor: theme.isDark ? '#3d2a1a' : '#FFF3E0' 
                        }]}>
                            <Ionicons name="calendar" size={24} color="#FF9800" />
                        </View>
                        <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats.thisMonth}</Text>
                        <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
                            {t('thisMonth')}
                        </Text>
                    </View>
                    
                    <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
                        <View style={[styles.statIconContainer, { 
                            backgroundColor: theme.isDark ? '#2d1f36' : '#F3E5F5' 
                        }]}>
                            <Ionicons name="time" size={24} color="#9C27B0" />
                        </View>
                        <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats.thisWeek}</Text>
                        <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
                            {t('thisWeek')}
                        </Text>
                    </View>
                    
                    <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
                        <View style={[styles.statIconContainer, { 
                            backgroundColor: theme.isDark ? '#1a2f1f' : '#E8F5E9' 
                        }]}>
                            <Ionicons name="grid" size={24} color="#4CAF50" />
                        </View>
                        <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats.categoriesCount}</Text>
                        <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
                            {t('categories')}
                        </Text>
                    </View>
                </View>

                {/* アクティビティサマリー */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="trending-up" size={20} color={theme.colors.primary} />
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            {t('activity')}
                        </Text>
                    </View>
                    <View style={[styles.activityCard, { backgroundColor: theme.colors.card }]}>
                        <View style={styles.activityRow}>
                            <View style={[styles.activityDot, { backgroundColor: theme.colors.primary }]} />
                            <Text style={[styles.activityText, { color: theme.colors.secondaryText }]}>
                                {t('average')} <Text style={[styles.activityValue, { color: theme.colors.text }]}>
                                    {stats.totalRecords > 0 ? Math.round(stats.totalRecords / 12) : 0}
                                </Text> {t('perMonth')}
                            </Text>
                        </View>
                        <View style={styles.activityRow}>
                            <View style={[styles.activityDot, { backgroundColor: theme.colors.primary }]} />
                            <Text style={[styles.activityText, { color: theme.colors.secondaryText }]}>
                                {t('longestStreak')} <Text style={[styles.activityValue, { color: theme.colors.text }]}>7</Text> {t('days')}
                            </Text>
                        </View>
                        <View style={styles.activityRow}>
                            <View style={[styles.activityDot, { backgroundColor: theme.colors.primary }]} />
                            <Text style={[styles.activityText, { color: theme.colors.secondaryText }]}>
                                {t('favoriteTime')} <Text style={[styles.activityValue, { color: theme.colors.text }]}>{t('afternoon')}</Text>
                            </Text>
                        </View>
                    </View>
                </View>

                {/* カテゴリー分析 */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="pie-chart" size={20} color={theme.colors.primary} />
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            {t('recordsByCategory')}
                        </Text>
                    </View>
                    <View style={[styles.categoryCard, { backgroundColor: theme.colors.card }]}>
                        <CategoryBar label="Café" count={Math.round(stats.totalRecords * 0.3)} total={stats.totalRecords} color="#FF6B6B" icon="cafe" theme={theme} />
                        <CategoryBar label="Film" count={Math.round(stats.totalRecords * 0.25)} total={stats.totalRecords} color="#4ECDC4" icon="film" theme={theme} />
                        <CategoryBar label="Daily" count={Math.round(stats.totalRecords * 0.2)} total={stats.totalRecords} color="#FFD93D" icon="calendar" theme={theme} />
                        <CategoryBar label="Travel" count={Math.round(stats.totalRecords * 0.15)} total={stats.totalRecords} color="#95E1D3" icon="airplane" theme={theme} />
                        <CategoryBar label="Other" count={Math.round(stats.totalRecords * 0.1)} total={stats.totalRecords} color="#C7CEEA" icon="ellipsis-horizontal" theme={theme} />
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

// カテゴリーバーコンポーネント
const CategoryBar = ({ label, count, total, color, icon, theme }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
        <View style={styles.categoryBarContainer}>
            <View style={styles.categoryBarHeader}>
                <View style={styles.categoryBarLabel}>
                    <Ionicons name={icon} size={16} color={color} />
                    <Text style={[styles.categoryBarText, { color: theme.colors.text }]}>{label}</Text>
                </View>
                <Text style={[styles.categoryBarCount, { color: theme.colors.secondaryText }]}>{count}</Text>
            </View>
            <View style={[styles.categoryBarTrack, { backgroundColor: theme.colors.border }]}>
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
    },
    topNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 4,
        width: 32,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
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
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
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
        marginLeft: 8,
    },
    // アクティビティカード
    activityCard: {
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
        marginRight: 12,
    },
    activityText: {
        fontSize: 15,
    },
    activityValue: {
        fontWeight: 'bold',
    },
    // カテゴリーカード
    categoryCard: {
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
        fontWeight: '500',
        marginLeft: 8,
    },
    categoryBarCount: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    categoryBarTrack: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    categoryBarFill: {
        height: '100%',
        borderRadius: 4,
    },
});

export default InsightScreen;
