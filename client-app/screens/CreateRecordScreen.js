import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TextInput, Alert, Text, ScrollView, Image, TouchableOpacity, Platform, Modal, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { useRecordsApi } from '../api/records';
import { fetchCategories } from '../api/categories';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageHelper';

export default function CreateRecordScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { userToken } = useContext(AuthContext);
    
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
        <SafeAreaView style={styles.container} edges={isEditMode ? ['bottom'] : ['top']}>
            <KeyboardAvoidingView 
                style={styles.container} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
            >
                {isEditMode && (
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>記録を編集</Text>
                        <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.saveButton}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#007AFF" />
                            ) : (
                                <Text style={styles.saveButtonText}>更新</Text>
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
                            <TouchableOpacity style={styles.imageSelectButton} onPress={pickImage}>
                                <Ionicons name="camera" size={40} color="#007AFF" />
                                <Text style={styles.imageSelectText}>写真を追加</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* 入力フォームエリア */}
                    <View style={styles.formSection}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>日付 <Text style={styles.required}>*</Text></Text>
                            <TouchableOpacity 
                                style={styles.dateInputContainer} 
                                onPress={() => setShowDatePicker(true)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="calendar-outline" size={24} color="#555" style={{ marginRight: 10 }} />
                                <Text style={styles.dateInputValue}>{formattedDate}</Text>
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
                            <Text style={styles.label}>カテゴリー</Text>
                            {categoriesLoading ? (
                                <ActivityIndicator size="small" color="#007AFF" />
                            ) : (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryPicker}>
                                    {categories.map(category => (
                                        <TouchableOpacity
                                            key={category.id}
                                            style={[
                                                styles.categoryOption,
                                                selectedCategoryId === category.id && styles.categoryOptionSelected,
                                                { borderColor: selectedCategoryId === category.id ? (category.color || '#007AFF') : '#eee' }
                                            ]}
                                            onPress={() => setSelectedCategoryId(category.id === selectedCategoryId ? null : category.id)}
                                        >
                                            <Ionicons 
                                                name={category.icon || 'folder-outline'} 
                                                size={18} 
                                                color={selectedCategoryId === category.id ? (category.color || '#007AFF') : '#666'} 
                                            />
                                            <Text style={[
                                                styles.categoryOptionText,
                                                selectedCategoryId === category.id && { color: category.color || '#007AFF', fontWeight: 'bold' }
                                            ]}>
                                                {category.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>タイトル</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="タイトルを入力"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        {/* コメントエリア */}
                        <View style={styles.commentGroup}>
                            <Text style={styles.label}>コメント</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="コメントを入力..."
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />
                        </View>
                    </View>

                    {/* 作成ボタン（新規作成モードのみ） */}
                    {!isEditMode && (
                        <TouchableOpacity
                            style={[styles.createButton, loading && styles.disabledButton]}
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
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
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
        color: '#007AFF',
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
        color: '#555',
    },
    required: {
        color: '#FF3B30',
    },
    input: {
        borderWidth: 1,
        borderColor: '#eee',
        padding: 10, 
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        fontSize: 15,
        color: '#333',
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
        backgroundColor: '#f0f5ff',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d0e0ff',
        borderStyle: 'dashed',
    },
    imageSelectText: {
        marginTop: 8,
        color: '#007AFF',
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
        borderColor: '#eee',
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    dateInputValue: {
        fontSize: 16,
        color: '#333',
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
        backgroundColor: '#007AFF',
        borderRadius: 30,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: "#007AFF",
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
        borderColor: '#eee',
        marginRight: 10,
        backgroundColor: '#f9f9f9',
    },
    categoryOptionSelected: {
        backgroundColor: '#fff',
    },
    categoryOptionText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#666',
    },
});
