import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PremiumPlanScreen = ({ navigation }) => {
    const [isPremium, setIsPremium] = useState(false);

    const handleSubscribe = () => {
        Alert.alert(
            'プレミアムプランへアップグレード',
            '月額980円でプレミアム機能をご利用いただけます。',
            [
                { text: 'キャンセル', style: 'cancel' },
                { 
                    text: '購読する', 
                    onPress: () => {
                        // TODO: 購読処理を実装
                        Alert.alert('完了', 'プレミアムプランにアップグレードしました');
                        setIsPremium(true);
                    }
                }
            ]
        );
    };

    const handleCancel = () => {
        Alert.alert(
            'プレミアムプランの解約',
            '本当に解約しますか？',
            [
                { text: 'キャンセル', style: 'cancel' },
                { 
                    text: '解約する', 
                    style: 'destructive',
                    onPress: () => {
                        // TODO: 解約処理を実装
                        Alert.alert('完了', 'プレミアムプランを解約しました');
                        setIsPremium(false);
                    }
                }
            ]
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
                <Text style={styles.headerTitle}>プレミアムプラン</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView}>
                {/* プランステータス */}
                <View style={styles.statusCard}>
                    <View style={styles.statusIconContainer}>
                        <Ionicons 
                            name={isPremium ? "diamond" : "diamond-outline"} 
                            size={48} 
                            color={isPremium ? "#FFD700" : "#999"} 
                        />
                    </View>
                    <Text style={styles.statusTitle}>
                        {isPremium ? 'プレミアムプラン利用中' : 'フリープラン'}
                    </Text>
                    <Text style={styles.statusSubtitle}>
                        {isPremium ? '次回更新日: 2025/01/20' : '無料でご利用いただけます'}
                    </Text>
                </View>

                {/* プレミアム機能 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>プレミアム機能</Text>
                    <View style={styles.featureCard}>
                        <FeatureItem 
                            icon="cloud-upload" 
                            title="無制限のクラウドストレージ" 
                            description="すべての写真と動画をクラウドに保存"
                        />
                        <FeatureItem 
                            icon="sparkles" 
                            title="高度なフィルター機能" 
                            description="プロフェッショナルな編集ツール"
                        />
                        <FeatureItem 
                            icon="stats-chart" 
                            title="詳細な統計とインサイト" 
                            description="記録の傾向を詳しく分析"
                        />
                        <FeatureItem 
                            icon="notifications-off" 
                            title="広告なし" 
                            description="快適な閲覧体験"
                        />
                        <FeatureItem 
                            icon="people" 
                            title="優先サポート" 
                            description="専門スタッフによる迅速なサポート"
                        />
                    </View>
                </View>

                {/* 価格 */}
                {!isPremium && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>料金プラン</Text>
                        <View style={styles.priceCard}>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceAmount}>¥980</Text>
                                <Text style={styles.priceUnit}>/月</Text>
                            </View>
                            <Text style={styles.priceNote}>いつでもキャンセル可能</Text>
                        </View>
                    </View>
                )}

                {/* ボタン */}
                <View style={styles.buttonSection}>
                    {!isPremium ? (
                        <TouchableOpacity 
                            style={styles.subscribeButton}
                            onPress={handleSubscribe}
                        >
                            <Ionicons name="diamond" size={20} color="#fff" />
                            <Text style={styles.subscribeButtonText}>プレミアムにアップグレード</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={handleCancel}
                        >
                            <Text style={styles.cancelButtonText}>プランを解約</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const FeatureItem = ({ icon, title, description }) => (
    <View style={styles.featureItem}>
        <View style={styles.featureIconContainer}>
            <Ionicons name={icon} size={24} color="#007AFF" />
        </View>
        <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDescription}>{description}</Text>
        </View>
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
    </View>
);

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
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    placeholder: {
        width: 32,
    },
    scrollView: {
        flex: 1,
    },
    statusCard: {
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 40,
        marginTop: 20,
        marginHorizontal: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statusIconContainer: {
        marginBottom: 16,
    },
    statusTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    statusSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        marginTop: 24,
        marginHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    featureCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    featureIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 13,
        color: '#666',
    },
    priceCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    priceAmount: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    priceUnit: {
        fontSize: 20,
        color: '#666',
        marginLeft: 4,
    },
    priceNote: {
        fontSize: 14,
        color: '#999',
    },
    buttonSection: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 40,
    },
    subscribeButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    subscribeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF3B30',
        textAlign: 'center',
    },
});

export default PremiumPlanScreen;
