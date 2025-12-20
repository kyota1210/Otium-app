import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const CategoryManagementScreen = ({ navigation }) => {
    // デフォルトカテゴリー（削除不可）
    const defaultCategories = [
        { id: 'all', name: 'All', icon: 'apps', color: '#007AFF', isDefault: true },
    ];

    // ユーザーカスタムカテゴリー
    const [customCategories, setCustomCategories] = useState([
        { id: 'cafe', name: 'Café', icon: 'cafe', color: '#FF6B6B', isDefault: false },
        { id: 'film', name: 'Film', icon: 'film', color: '#4ECDC4', isDefault: false },
        { id: 'daily', name: 'Daily', icon: 'calendar', color: '#FFD93D', isDefault: false },
        { id: 'travel', name: 'Travel', icon: 'airplane', color: '#95E1D3', isDefault: false },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('bookmark');
    const [selectedColor, setSelectedColor] = useState('#007AFF');

    // アイコン選択肢
    const availableIcons = [
        'bookmark', 'cafe', 'film', 'calendar', 'airplane', 'camera', 
        'book', 'musical-notes', 'fitness', 'car', 'home', 'gift', 
        'heart', 'star', 'wine', 'restaurant', 'leaf', 'game-controller', 
        'color-palette', 'paw'
    ];

    // カラー選択肢
    const availableColors = [
        '#007AFF', '#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3', '#C7CEEA',
        '#FF9800', '#9C27B0', '#4CAF50', '#FF5722', '#795548', '#607D8B',
        '#000000'
    ];

    const handleAddCategory = () => {
        if (!categoryName.trim()) {
            Alert.alert('エラー', 'カテゴリー名を入力してください');
            return;
        }

        const newCategory = {
            id: Date.now().toString(),
            name: categoryName.trim(),
            icon: selectedIcon,
            color: selectedColor,
            isDefault: false,
        };

        setCustomCategories([...customCategories, newCategory]);
        resetForm();
        Alert.alert('完了', 'カテゴリーを追加しました');
    };

    const handleEditCategory = () => {
        if (!categoryName.trim()) {
            Alert.alert('エラー', 'カテゴリー名を入力してください');
            return;
        }

        const updatedCategories = customCategories.map(cat => 
            cat.id === editingCategory.id 
                ? { ...cat, name: categoryName.trim(), icon: selectedIcon, color: selectedColor }
                : cat
        );

        setCustomCategories(updatedCategories);
        resetForm();
        Alert.alert('完了', 'カテゴリーを更新しました');
    };

    const handleDeleteCategory = (category) => {
        Alert.alert(
            'カテゴリーを削除',
            `「${category.name}」を削除しますか？`,
            [
                { text: 'キャンセル', style: 'cancel' },
                {
                    text: '削除',
                    style: 'destructive',
                    onPress: () => {
                        setCustomCategories(customCategories.filter(cat => cat.id !== category.id));
                        Alert.alert('完了', 'カテゴリーを削除しました');
                    }
                }
            ]
        );
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setCategoryName(category.name);
        setSelectedIcon(category.icon);
        setSelectedColor(category.color);
        setShowAddModal(true);
    };

    const resetForm = () => {
        setShowAddModal(false);
        setEditingCategory(null);
        setCategoryName('');
        setSelectedIcon('bookmark');
        setSelectedColor('#007AFF');
    };

    const allCategories = [...defaultCategories, ...customCategories];

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
                <Text style={styles.headerTitle}>カテゴリー管理</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView}>
                {/* カテゴリーリスト */}
                <View style={styles.section}>
                    <View style={styles.categoryList}>
                        {allCategories.map((category) => (
                            <View key={category.id} style={styles.categoryCard}>
                                <View style={styles.categoryInfo}>
                                    <View 
                                        style={[
                                            styles.categoryIconCircle, 
                                            { backgroundColor: category.color }
                                        ]}
                                    >
                                        <Ionicons name={category.icon} size={24} color="#fff" />
                                    </View>
                                    <Text style={styles.categoryNameText}>{category.name}</Text>
                                </View>
                                {!category.isDefault && (
                                    <View style={styles.categoryActions}>
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() => openEditModal(category)}
                                        >
                                            <Ionicons name="create-outline" size={22} color="#007AFF" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() => handleDeleteCategory(category)}
                                        >
                                            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* 追加ボタン */}
                <View style={styles.addButtonSection}>
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => setShowAddModal(true)}
                    >
                        <Ionicons name="add-circle" size={24} color="#fff" />
                        <Text style={styles.addButtonText}>新しいカテゴリーを追加</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* カテゴリー追加・編集モーダル */}
            <Modal
                visible={showAddModal}
                animationType="slide"
                transparent={true}
                onRequestClose={resetForm}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingCategory ? 'カテゴリーを編集' : '新しいカテゴリー'}
                            </Text>
                            <TouchableOpacity onPress={resetForm}>
                                <Ionicons name="close" size={28} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            {/* カテゴリー名 */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>カテゴリー名</Text>
                                <TextInput
                                    style={styles.input}
                                    value={categoryName}
                                    onChangeText={setCategoryName}
                                    placeholder="例: 読書、運動、料理"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            {/* アイコン選択 */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>アイコン</Text>
                                <View style={styles.iconGrid}>
                                    {availableIcons.map((icon) => (
                                        <TouchableOpacity
                                            key={icon}
                                            style={[
                                                styles.iconOption,
                                                selectedIcon === icon && styles.iconOptionSelected
                                            ]}
                                            onPress={() => setSelectedIcon(icon)}
                                        >
                                            <Ionicons 
                                                name={icon} 
                                                size={28} 
                                                color={selectedIcon === icon ? '#007AFF' : '#666'} 
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* カラー選択 */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>カラー</Text>
                                <View style={styles.colorGrid}>
                                    {availableColors.map((color) => (
                                        <TouchableOpacity
                                            key={color}
                                            style={[
                                                styles.colorOption,
                                                { backgroundColor: color },
                                                selectedColor === color && styles.colorOptionSelected
                                            ]}
                                            onPress={() => setSelectedColor(color)}
                                        >
                                            {selectedColor === color && (
                                                <Ionicons name="checkmark" size={20} color="#fff" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* プレビュー */}
                            <View style={styles.previewSection}>
                                <Text style={styles.label}>プレビュー</Text>
                                <View style={styles.previewCard}>
                                    <View 
                                        style={[
                                            styles.previewIcon, 
                                            { backgroundColor: selectedColor }
                                        ]}
                                    >
                                        <Ionicons name={selectedIcon} size={32} color="#fff" />
                                    </View>
                                    <Text style={styles.previewText}>
                                        {categoryName || 'カテゴリー名'}
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>

                        {/* ボタン */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity 
                                style={styles.cancelButton}
                                onPress={resetForm}
                            >
                                <Text style={styles.cancelButtonText}>キャンセル</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.saveButton}
                                onPress={editingCategory ? handleEditCategory : handleAddCategory}
                            >
                                <Text style={styles.saveButtonText}>
                                    {editingCategory ? '更新' : '追加'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

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
        backgroundColor: '#f5f5f5',
    },
    section: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    categoryList: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 16,
    },
    categoryCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    categoryNameText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    defaultBadge: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    defaultBadgeText: {
        fontSize: 11,
        color: '#666',
    },
    categoryActions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 8,
        marginLeft: 4,
    },
    addButtonSection: {
        padding: 16,
    },
    addButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
    },
    // モーダルスタイル
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '92%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        letterSpacing: 0.3,
    },
    modalBody: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 12,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 6,
        letterSpacing: 0.2,
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#e8e8e8',
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 0,
        marginHorizontal: -4,
        justifyContent: 'flex-start',
    },
    iconOption: {
        width: '14.36%',
        aspectRatio: 1,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    iconOptionSelected: {
        borderColor: '#007AFF',
        backgroundColor: '#E8F4FF',
        transform: [{ scale: 1.05 }],
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 0,
        marginHorizontal: -4,
    },
    colorOption: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        borderWidth: 3,
        borderColor: 'transparent',
    },
    colorOptionSelected: {
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 6,
        transform: [{ scale: 1.1 }],
    },
    previewSection: {
        marginTop: 8,
        marginBottom: 12,
    },
    previewCard: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 24,
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#e8e8e8',
    },
    previewIcon: {
        width: 88,
        height: 88,
        borderRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    previewText: {
        fontSize: 19,
        fontWeight: '600',
        color: '#1a1a1a',
        letterSpacing: 0.3,
    },
    modalFooter: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 20,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 16,
        marginRight: 8,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e8e8e8',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        letterSpacing: 0.2,
    },
    saveButton: {
        flex: 1,
        paddingVertical: 16,
        marginLeft: 8,
        borderRadius: 12,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        letterSpacing: 0.2,
    },
});

export default CategoryManagementScreen;
