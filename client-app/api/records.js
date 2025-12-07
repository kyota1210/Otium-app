import { useApiClient } from './client';
import { useCallback } from 'react';

export const useRecordsApi = () => {
    const { apiFetch } = useApiClient();

    // 記録の作成 (Create)
    const createRecord = useCallback(async (recordData) => {
        return apiFetch('/records', {
            method: 'POST',
            body: recordData,
        });
    }, [apiFetch]);

    // 自分の記録を全て取得 (Read)
    const fetchRecords = useCallback(async () => {
        return apiFetch('/records', {
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