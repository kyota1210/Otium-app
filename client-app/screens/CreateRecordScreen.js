import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TextInput, Alert, Text, ScrollView, Image, TouchableOpacity, Platform, Modal, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { useRecordsApi } from '../api/records';
import { fetchCategories } from '../api/categories';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getImageUrl } from '../utils/imageHelper';

export default function CreateRecordScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { userToken } = useContext(AuthContext);
    const { theme } = useTheme();
    
    // 編集モードの判定
    const editRecord = route.params?.record;
    const isEditMode = !!editRecord;

    const [title, setTitle] = useState(editRecord?.title || '');
    const [description, setDescription] = useState(editRecord?.description || '');
    
    // 日付管理
    const [dateLogged, setDateLogged] = useState(editRecord ? new Date(editRecord.date_logged) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [imageUri, setImageUri] = useState(editRecord?.image_url ? getImageUrl(editRecord.image_url) : null);
    const [loading, setLoading] = useState(false);
    
    // カテゴリー管理
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(editRecord?.category_id || null);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const { createRecord, updateRecord } = useRecordsApi();

    // カテゴリーを取得
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories(userToken);
                setCategories(data);
            } catch (error) {
                console.error('カテゴリー取得エラー:', error);
            } finally {
                setCategoriesLoading(false);
            }
        };
        loadCategories();
    }, [userToken]);

    // 日付変更ハンドラ
    const onChangeDate = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setShowDatePicker(false);
            return;
        }

        const currentDate = selectedDate || dateLogged;
        setShowDatePicker(false);
        
        if (selectedDate) {
            setDateLogged(currentDate);
        }
    };

    // 画像を選択する関数
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('権限エラー', '画像をアップロードするにはカメラロールへのアクセス許可が必要です。');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,  // トリミングを無効化して元の縦横比を保持
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!dateLogged) {
            Alert.alert('エラー', '日付は必須です。');
            return;
        }

        setLoading(true);
        try {
            const recordData = { 
                title,
                description, 
                date_logged: dateLogged.toISOString().split('T')[0], 
                imageUri,
                category_id: selectedCategoryId
            };

            if (isEditMode) {
                await updateRecord(editRecord.id, recordData);
                Alert.alert('成功', '記録が更新されました。');
                navigation.goBack();
            } else {
                await createRecord(recordData);
                Alert.alert('成功', '新しい記録が追加されました。');
                setTitle('');
                setDescription('');
                setImageUri(null);
                setSelectedCategoryId(null);
                navigation.navigate('Home'); 
            }
        } catch (error) {
            Alert.alert(isEditMode ? '更新失敗' : '作成失敗', error.message);
        } finally {
            setLoading(false);
        }
    };

    const formattedDate = dateLogged.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={isEditMode ? ['bottom'] : ['top']}>
            <KeyboardAvoidingView 
                style={[styles.container, { backgroundColor: theme.colors.background }]} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
            >
                {isEditMode && (
                    <View style={[styles.header, { 
                        backgroundColor: theme.colors.background,
                        borderBottomColor: theme.colors.border 
                    }]}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color={theme.colors.icon} />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>記録を編集</Text>
                        <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.saveButton}>
                            {loading ? (
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            ) : (
                                <Text style={[styles.saveButtonText, { color: theme.colors.primary }]}>更新</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
                
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* 画像選択エリア */}
                    <View style={styles.imageSection}>
                        {imageUri ? (
                            <View style={styles.imagePreviewContainer}>
                                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                                <TouchableOpacity 
                                    style={styles.removeImageButton} 
                                    onPress={() => setImageUri(null)}
                                >
                                    <Ionicons name="close-circle" size={30} color="#FF3B30" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={[styles.imageSelectButton, {
                                backgroundColor: theme.isDark ? '#1a2a3a' : '#f0f5ff',
                                borderColor: theme.isDark ? '#2a3a4a' : '#d0e0ff'
                            }]} onPress={pickImage}>
                                <Ionicons name="camera" size={40} color={theme.colors.primary} />
                                <Text style={[styles.imageSelectText, { color: theme.colors.primary }]}>写真を追加</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* 入力フォームエリア */}
                    <View style={styles.formSection}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
                                日付 <Text style={styles.required}>*</Text>
                            </Text>
                            <TouchableOpacity 
                                style={[styles.dateInputContainer, { 
                                    backgroundColor: theme.colors.secondaryBackground,
                                    borderColor: theme.colors.border 
                                }]} 
                                onPress={() => setShowDatePicker(true)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="calendar-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 10 }} />
                                <Text style={[styles.dateInputValue, { color: theme.colors.text }]}>{formattedDate}</Text>
                            </TouchableOpacity>
                            
                            {showDatePicker && Platform.OS === 'android' && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={dateLogged}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDate}
                                />
                            )}

                            {showDatePicker && Platform.OS === 'ios' && (
                                <Modal
                                    transparent={true}
                                    animationType="fade"
                                    visible={showDatePicker}
                                    onRequestClose={() => setShowDatePicker(false)}
                                >
                                    <TouchableOpacity 
                                        style={styles.modalOverlay} 
                                        activeOpacity={1} 
                                        onPress={() => setShowDatePicker(false)}
                                    >
                                        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={dateLogged}
                                                mode="date"
                                                display="inline"
                                                onChange={onChangeDate}
                                                style={styles.iosDatePicker}
                                                themeVariant="light"
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </Modal>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.colors.secondaryText }]}>カテゴリー</Text>
                            {categoriesLoading ? (
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            ) : (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryPicker}>
                                    {categories.map(category => (
                                        <TouchableOpacity
                                            key={category.id}
                                            style={[
                                                styles.categoryOption,
                                                { 
                                                    backgroundColor: theme.colors.secondaryBackground,
                                                    borderColor: theme.colors.border 
                                                },
                                                selectedCategoryId === category.id && [
                                                    styles.categoryOptionSelected,
                                                    { 
                                                        backgroundColor: theme.colors.card,
                                                        borderColor: category.color || theme.colors.primary 
                                                    }
                                                ]
                                            ]}
                                            onPress={() => setSelectedCategoryId(category.id === selectedCategoryId ? null : category.id)}
                                        >
                                            <Ionicons 
                                                name={category.icon || 'folder-outline'} 
                                                size={18} 
                                                color={selectedCategoryId === category.id ? (category.color || theme.colors.primary) : theme.colors.secondaryText} 
                                            />
                                            <Text style={[
                                                styles.categoryOptionText,
                                                { color: theme.colors.secondaryText },
                                                selectedCategoryId === category.id && { 
                                                    color: category.color || theme.colors.primary, 
                                                    fontWeight: 'bold' 
                                                }
                                            ]}>
                                                {category.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.colors.secondaryText }]}>タイトル</Text>
                            <TextInput
                                style={[styles.input, { 
                                    backgroundColor: theme.colors.secondaryBackground,
                                    borderColor: theme.colors.border,
                                    color: theme.colors.text 
                                }]}
                                placeholder="タイトルを入力"
                                placeholderTextColor={theme.colors.inactive}
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        {/* コメントエリア */}
                        <View style={styles.commentGroup}>
                            <Text style={[styles.label, { color: theme.colors.secondaryText }]}>コメント</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, { 
                                    backgroundColor: theme.colors.secondaryBackground,
                                    borderColor: theme.colors.border,
                                    color: theme.colors.text 
                                }]}
                                placeholder="コメントを入力..."
                                placeholderTextColor={theme.colors.inactive}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />
                        </View>
                    </View>

                    {/* 作成ボタン（新規作成モードのみ） */}
                    {!isEditMode && (
                        <TouchableOpacity
                            style={[
                                styles.createButton, 
                                { backgroundColor: theme.colors.primary },
                                loading && styles.disabledButton
                            ]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            <Text style={styles.createButtonText}>
                                {loading ? "作成中..." : "作成する"}
                            </Text>
                            {!loading && <Ionicons name="checkmark-circle-outline" size={24} color="#fff" style={{ marginLeft: 8 }} />}
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    saveButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
        paddingBottom: 16,
    },
    formSection: {
        marginTop: 12,
    },
    inputGroup: {
        marginBottom: 12, 
    },
    commentGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4,
    },
    required: {
        color: '#FF3B30',
    },
    input: {
        borderWidth: 1,
        padding: 10, 
        borderRadius: 12,
        fontSize: 15,
    },
    textArea: {
        textAlignVertical: 'top',
        minHeight: 80,
    },
    imageSection: {
        width: '100%',
        height: 180,
        marginBottom: 8,
    },
    imageSelectButton: {
        flex: 1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    imageSelectText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    imagePreviewContainer: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',  // 画像全体を表示（トリミングなし）
    },
    removeImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 2,
    },
    dateInputContainer: {
        borderWidth: 1,
        padding: 12,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    dateInputValue: {
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        alignItems: 'center',
    },
    iosDatePicker: {
        width: 320,
        height: 320,
    },
    createButton: {
        borderRadius: 30,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: '#A0C4FF',
        shadowOpacity: 0,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
    categoryPicker: {
        flexDirection: 'row',
    },
    categoryOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 10,
    },
    categoryOptionSelected: {
        // 選択時のスタイルは動的に適用
    },
    categoryOptionText: {
        marginLeft: 6,
        fontSize: 14,
    },
});
