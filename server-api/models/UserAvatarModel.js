const db = require('../db');

class UserAvatarModel {
    /**
     * ユーザーIDでアバター画像を取得
     * @param {number} userId 
     */
    static async findByUserId(userId) {
        const sql = 'SELECT id, user_id, image_url, created_at, updated_at FROM user_avatars WHERE user_id = ?';
        const [rows] = await db.query(sql, [userId]);
        return rows[0];
    }

    /**
     * アバター画像を作成または更新
     * @param {number} userId 
     * @param {string} imageUrl 
     */
    static async upsert(userId, imageUrl) {
        // まず既存のレコードを確認
        const existing = await this.findByUserId(userId);
        
        if (existing) {
            // 更新
            const sql = 'UPDATE user_avatars SET image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?';
            await db.query(sql, [imageUrl, userId]);
            return existing.id;
        } else {
            // 新規作成
            const sql = 'INSERT INTO user_avatars (user_id, image_url) VALUES (?, ?)';
            const [result] = await db.query(sql, [userId, imageUrl]);
            return result.insertId;
        }
    }

    /**
     * アバター画像を削除
     * @param {number} userId 
     */
    static async deleteByUserId(userId) {
        const sql = 'DELETE FROM user_avatars WHERE user_id = ?';
        await db.query(sql, [userId]);
    }
}

module.exports = UserAvatarModel;
