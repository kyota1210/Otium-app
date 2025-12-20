const db = require('../db');

class RecordModel {
    /**
     * 特定ユーザーの全記録を取得
     */
    static async findAllByUserId(userId, categoryId = null) {
        let sql = `
            SELECT r.id, r.title, r.description, r.created_at, r.date_logged, r.image_url, r.category_id,
                   c.name as category_name, c.icon as category_icon, c.color as category_color
            FROM records r
            LEFT JOIN categories c ON r.category_id = c.id
            WHERE r.user_id = ? AND r.invalidation_flag = 0
        `;
        const params = [userId];
        
        // カテゴリーフィルタリング
        if (categoryId !== null) {
            sql += ' AND r.category_id = ?';
            params.push(categoryId);
        }
        
        sql += ' ORDER BY r.created_at DESC';
        
        const [rows] = await db.query(sql, params);
        return rows;
    }

    /**
     * 新しい記録を作成
     */
    static async create({ userId, title, description, dateLogged, imageUrl, categoryId }) {
        // image_url と category_id を保存するように変更
        const sql = `
            INSERT INTO records (user_id, title, description, date_logged, invalidation_flag, image_url, category_id) 
            VALUES (?, ?, ?, ?, 0, ?, ?)
        `;
        const [result] = await db.query(sql, [userId, title, description, dateLogged, imageUrl, categoryId || null]);
        return result.insertId;
    }

    /**
     * 記録を更新（IDと所有者を確認）
     */
    static async update(id, userId, { title, description, categoryId }) {
        const sql = `
            UPDATE records 
            SET title = ?, description = ?, category_id = ?
            WHERE id = ? AND user_id = ?
        `;
        const [result] = await db.query(sql, [title, description, categoryId || null, id, userId]);
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
