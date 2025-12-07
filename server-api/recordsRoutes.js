const express = require('express');
const router = express.Router();
const db = require('./db');
const auth = require('./middleware/auth');

// すべてのルートで認証ミドルウェアを適用
router.use(auth);

// ------------------------------------------------
// 1. 記録の作成 (Create)
// POST /api/records
// ------------------------------------------------
router.post('/', async (req, res) => {
    console.log('記録登録てすと');
    console.log(req.body);
    console.log(req);
    const { title, description, date_logged } = req.body;
    const user_id = req.user.id;

    if (!title || !date_logged) {
        return res.status(400).json({ message: 'タイトルと日付は必須です。' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO records (user_id, title, description, date_logged, invalidation_flag) VALUES (?, ?, ?, ?, 0)',
            [user_id, title, description, date_logged]
        );

        res.status(201).json({ 
            message: '記録が作成されました。',
            recordId: result.insertId
        });
    } catch (error) {
        console.error('記録作成エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// ------------------------------------------------
// 2. 記録の取得 (Read) - 自分の記録を全て取得
// GET /api/records
// ------------------------------------------------
router.get('/', async (req, res) => {
    const user_id = req.user.id; // 自分のIDのみを使用

    try {
        // 特定の user_id に紐づく記録のみを取得
        const [records] = await db.query(
            'SELECT id, title, description, created_at FROM records WHERE user_id = ? AND invalidation_flag = 0 ORDER BY created_at DESC',
            [user_id]
        );

        res.status(200).json(records);
    } catch (error) {
        console.error('記録取得エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// ------------------------------------------------
// 3. 記録の更新 (Update)
// PUT /api/records/:id
// ------------------------------------------------
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const user_id = req.user.id;

    if (!title || !date_logged) {
        return res.status(400).json({ message: 'タイトルと日付は必須です。' });
    }

    try {
        const [result] = await db.query(
            'UPDATE records SET title=?, description=?, WHERE id=? AND user_id=?',
            [title, description, id, user_id]
        );

        if (result.affectedRows === 0) {
            // 記録が存在しないか、他のユーザーの記録を更新しようとした場合
            return res.status(404).json({ message: '記録が見つからないか、更新権限がありません。' });
        }

        res.status(200).json({ message: '記録が更新されました。' });
    } catch (error) {
        console.error('記録更新エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// ------------------------------------------------
// 4. 記録の削除 (Delete)
// DELETE /api/records/:id
// ------------------------------------------------
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        const [result] = await db.query(
            'UPDATE records SET invalidation_flag=1, delete_at=now() WHERE id=? AND user_id=?',
            [id, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '記録が見つからないか、削除権限がありません。' });
        }

        res.status(200).json({ message: '記録が削除されました。' });
    } catch (error) {
        console.error('記録削除エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

module.exports = router;