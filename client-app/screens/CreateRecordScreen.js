import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Alert, Text, ScrollView, Image, TouchableOpacity, Platform, Modal, KeyboardAvoidingView } from 'react-native';
import { useRecordsApi } from '../api/records';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateRecordScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    // 日付管理
    const [dateLogged, setDateLogged] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(false);

    const { createRecord } = useRecordsApi();

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
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleCreate = async () => {
        if (!dateLogged) {
            Alert.alert('エラー', '日付は必須です。');
            return;
        }

        setLoading(true);
        try {
            await createRecord({ 
                title,
                description, 
                date_logged: dateLogged.toISOString().split('T')[0], 
                imageUri 
            });
            
            Alert.alert('成功', '新しい記録が追加されました。');
            setTitle('');
            setDescription('');
            setImageUri(null);
            navigation.goBack(); 
        } catch (error) {
            Alert.alert('作成失敗', error.message);
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
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView 
                style={styles.container} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* 画像選択エリア (flexで伸縮) */}
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
                            <Text style={styles.label}>タイトル</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="タイトルを入力"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        {/* コメントエリア (flexで伸縮) */}
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

                    {/* 作成ボタン */}
                    <TouchableOpacity
                        style={[styles.createButton, loading && styles.disabledButton]}
                        onPress={handleCreate}
                        disabled={loading}
                    >
                        <Text style={styles.createButtonText}>
                            {loading ? "作成中..." : "作成する"}
                        </Text>
                        {!loading && <Ionicons name="checkmark-circle-outline" size={24} color="#fff" style={{ marginLeft: 8 }} />}
                    </TouchableOpacity>
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
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 20,
        justifyContent: 'space-between', 
    },
    formSection: {
        flex: 1, // 入力エリア全体も伸縮させる
        justifyContent: 'space-between',
    },
    inputGroup: {
        marginBottom: 12, 
    },
    commentGroup: {
        flex: 1, 
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        color: '#555',
    },
    required: {
        color: '#FF3B30',
    },
    input: {
        borderWidth: 1,
        borderColor: '#eee',
        padding: 12, 
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
        color: '#333',
    },
    textArea: {
        flex: 1, 
        textAlignVertical: 'top',
        minHeight: 80, // 少し高さを確保
    },
    imageSection: {
        flex: 0.8, 
        minHeight: 150,
        marginBottom: 16,
    },
    imageSelectButton: {
        flex: 1,
        width: '100%',
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
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    iosDatePicker: {
        width: 320,
        height: 320,
    },
    createButton: {
        backgroundColor: '#007AFF',
        borderRadius: 30,
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
    disabledButton: {
        backgroundColor: '#A0C4FF',
        shadowOpacity: 0,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
