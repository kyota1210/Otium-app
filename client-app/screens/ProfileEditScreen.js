import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from '../api/user';
import { SERVER_URL } from '../config';

const ProfileEditScreen = ({ navigation }) => {
    const { userInfo, userToken, authContext } = useContext(AuthContext);
    const [userName, setUserName] = useState(userInfo?.user_name || '');
    const [avatarUri, setAvatarUri] = useState(
        userInfo?.avatar_url ? `${SERVER_URL}/${userInfo.avatar_url}` : null
    );
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handlePickImage = async () => {
        // パーミッションを要求
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('権限が必要です', '写真ライブラリへのアクセスを許可してください');
            return;
        }

        // 画像を選択
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setAvatarUri(uri);
            
            // ファイル情報を保存（アップロード用）
            const fileName = uri.split('/').pop();
            const fileType = `image/${fileName.split('.').pop()}`;
            setSelectedFile({
                uri: uri,
                name: fileName,
                type: fileType,
            });
        }
    };

    const handleSave = async () => {
        if (!userName.trim()) {
            Alert.alert('エラー', 'ユーザー名を入力してください');
            return;
        }

        setIsLoading(true);
        try {
            // プロフィール更新APIを呼び出す
            const data = await updateProfile(userToken, userName, selectedFile);
            
            // AuthContextのユーザー情報を更新
            authContext.updateUserInfo(data.user);
            
            Alert.alert('保存完了', 'プロフィールを更新しました', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('プロフィール更新エラー:', error);
            Alert.alert('エラー', error.message || 'プロフィールの更新に失敗しました');
        } finally {
            setIsLoading(false);
        }
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
                <Text style={styles.headerTitle}>プロフィール設定</Text>
                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#007AFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>保存</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
                {/* アバター */}
                <View style={styles.avatarSection}>
                    <TouchableOpacity 
                        style={styles.avatarContainer}
                        onPress={handlePickImage}
                    >
                        {avatarUri ? (
                            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons name="person" size={50} color="#fff" />
                            </View>
                        )}
                        <View style={styles.cameraIconContainer}>
                            <Ionicons name="camera" size={20} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.avatarHint}>タップして写真を選択</Text>
                </View>

                {/* フォーム */}
                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>ユーザー名</Text>
                        <TextInput
                            style={styles.input}
                            value={userName}
                            onChangeText={setUserName}
                            placeholder="ユーザー名を入力"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>
            </ScrollView>
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
    saveButton: {
        padding: 4,
    },
    saveButtonText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    avatarSection: {
        backgroundColor: '#667eea',
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
        position: 'relative',
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        position: 'relative',
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fff',
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff',
    },
    cameraIconContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    avatarHint: {
        fontSize: 14,
        color: '#fff',
        marginTop: 4,
    },
    formSection: {
        backgroundColor: '#fff',
        marginTop: 0,
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
});

export default ProfileEditScreen;
