import { useApiClient } from './client';
import { useCallback } from 'react';

export const useRecordsApi = () => {
    const { apiFetch } = useApiClient();

    // 記録の作成 (Create)
    const createRecord = useCallback(async (recordData) => {
        // FormDataを作成して画像データを送信可能にする
        const formData = new FormData();
        formData.append('title', recordData.title);
        formData.append('description', recordData.description || '');
        formData.append('date_logged', recordData.date_logged);
        
        // カテゴリーIDを追加
        if (recordData.category_id) {
            formData.append('category_id', recordData.category_id);
        }

        if (recordData.imageUri) {
            // 画像ファイルの処理
            const localUri = recordData.imageUri;
            const filename = localUri.split('/').pop();

            // 拡張子からMIMEタイプを推測
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('image', {
                uri: localUri,
                name: filename,
                type,
            });
        }

        return apiFetch('/records', {
            method: 'POST',
            body: formData,
        });
    }, [apiFetch]);

    // 自分の記録を全て取得 (Read)
    // categoryIdを指定すると、そのカテゴリーでフィルタリング
    const fetchRecords = useCallback(async (categoryId = null) => {
        const url = categoryId ? `/records?category_id=${categoryId}` : '/records';
        return apiFetch(url, {
            method: 'GET',
        });
    }, [apiFetch]);

    // 記録の削除 (Delete)
    const deleteRecord = async (id) => {
        return apiFetch(`/records/${id}`, {
            method: 'DELETE',
        });
    };
    
    // (更新 update はここでは省略しますが、必要に応じて追加してください)

    return { createRecord, fetchRecords, deleteRecord };
};
