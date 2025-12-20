import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRecordsApi } from '../api/records';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getImageUrl } from '../utils/imageHelper';
import { useFocusEffect } from '@react-navigation/native';

export default function RecordDetailScreen({ route, navigation }) {
    const { record: initialRecord } = route.params;
    const [record, setRecord] = useState(initialRecord);
    const [loading, setLoading] = useState(false);
    const [imageAspectRatio, setImageAspectRatio] = useState(1);
    const { deleteRecord, fetchRecordById } = useRecordsApi();
    const { theme } = useTheme();
    const { t } = useLanguage();

    // 画面が表示されるたびに最新データを取得
    useFocusEffect(
        useCallback(() => {
            const loadRecord = async () => {
                try {
                    const updatedRecord = await fetchRecordById(initialRecord.id);
                    setRecord(updatedRecord);
                } catch (error) {
                    console.error(t('recordFetchFailed'), error);
                }
            };
            loadRecord();
        }, [initialRecord.id, fetchRecordById, t])
    );

    // 画像の縦横比を取得
    const imageUrl = getImageUrl(record.image_url);
    
    React.useEffect(() => {
        if (imageUrl) {
            Image.getSize(
                imageUrl,
                (width, height) => {
                    setImageAspectRatio(width / height);
                },
                (error) => {
                    console.error(t('imageSizeFetchFailed'), error);
                    setImageAspectRatio(16 / 9); // デフォルト値
                }
            );
        }
    }, [imageUrl]);

    const handleDelete = () => {
        Alert.alert(
            t('deleteConfirm'),
            t('deleteConfirmMessage'),
            [
                { text: t('cancel') },
                {
                    text: t('delete'),
                    onPress: async () => {
                        try {
                            await deleteRecord(record.id);
                            navigation.goBack(); // 削除後に前の画面に戻る
                        } catch (error) {
                            Alert.alert(t('deleteFailed'), error.message);
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const handleEdit = () => {
        navigation.navigate('EditRecord', { record });
    };

    // 日付の表示形式を調整
    const date = new Date(record.date_logged);
    const dateString = date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* 画像があれば表示、なければプレースホルダー */}
                {imageUrl ? (
                    <View style={[styles.imageContainer, { aspectRatio: imageAspectRatio }]}>
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    </View>
                ) : (
                    <View style={[styles.placeholderImageContainer, { backgroundColor: theme.colors.border }]}>
                        <Ionicons name="image-outline" size={80} color={theme.colors.inactive} />
                        <Text style={[styles.placeholderText, { color: theme.colors.inactive }]}>
                            {t('noImage')}
                        </Text>
                    </View>
                )}

                <View style={styles.infoContainer}>
                    <Text style={[styles.date, { color: theme.colors.secondaryText }]}>{dateString}</Text>
                    <Text style={[styles.title, { color: theme.colors.text }]}>{record.title}</Text>
                    {record.description && (
                        <Text style={[styles.description, { color: theme.colors.secondaryText }]}>
                            {record.description}
                        </Text>
                    )}
                </View>
            </ScrollView>

            <View style={[styles.footer, { 
                backgroundColor: theme.colors.background,
                borderTopColor: theme.colors.border 
            }]}>
                <TouchableOpacity style={styles.footerButton} onPress={handleEdit}>
                    <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
                    <Text style={[styles.footerButtonText, { color: theme.colors.primary }]}>
                        {t('edit')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
    },
    content: { paddingBottom: 80 },
    imageContainer: {
        width: '100%',
        backgroundColor: '#000',
    },
    image: { 
        width: '100%', 
        height: '100%', 
        resizeMode: 'contain' 
    },
    placeholderImageContainer: {
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: { 
        marginTop: 10 
    },
    infoContainer: { padding: 20 },
    date: { 
        fontSize: 14, 
        marginBottom: 8 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 16 
    },
    description: { 
        fontSize: 16, 
        lineHeight: 24 
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingBottom: 20, // iPhoneの下部バー領域用
    },
    footerButton: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    footerButtonText: { 
        marginLeft: 8, 
        fontSize: 16,
    },
    deleteButton: { padding: 10 },
});
