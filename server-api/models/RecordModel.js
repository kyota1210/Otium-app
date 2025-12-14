const db = require('../db');

class RecordModel {
    /**
     * 特定ユーザーの全記録を取得
     */
    static async findAllByUserId(userId) {
        // image_url も取得するように変更
        const sql = `
            SELECT id, title, description, created_at, date_logged, image_url 
            FROM records 
            WHERE user_id = ? AND invalidation_flag = 0 
            ORDER BY created_at DESC
        `;
        const [rows] = await db.query(sql, [userId]);
        return rows;
    }

    /**
     * 新しい記録を作成
     */
    static async create({ userId, title, description, dateLogged, imageUrl }) {
        // image_url を保存するように変更
        const sql = `
            INSERT INTO records (user_id, title, description, date_logged, invalidation_flag, image_url) 
            VALUES (?, ?, ?, ?, 0, ?)
        `;
        const [result] = await db.query(sql, [userId, title, description, dateLogged, imageUrl]);
        return result.insertId;
    }

    /**
     * 記録を更新（IDと所有者を確認）
     */
    static async update(id, userId, { title, description }) {
        const sql = `
            UPDATE records 
            SET title = ?, description = ? 
            WHERE id = ? AND user_id = ?
        `;
        const [result] = await db.query(sql, [title, description, id, userId]);
        return result.affectedRows > 0; // 更新できたかどうかをbooleanで返す
    }

    /**
     * 記録を論理削除（IDと所有者を確認）
     */
    static async softDelete(id, userId) {
        const sql = `
            UPDATE records 
            SET invalidation_flag = 1, delete_at = NOW() 
            WHERE id = ? AND user_id = ?
        `;
        const [result] = await db.query(sql, [id, userId]);
        return result.affectedRows > 0;
    }
}

module.exports = RecordModel;
