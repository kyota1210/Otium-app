const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db'); // データベース接続プールをインポート

// JWTの秘密鍵は.envから取得
const JWT_SECRET = process.env.JWT_SECRET;

// ------------------------------------------------
// POST /api/auth/signup (ユーザー登録)
// ------------------------------------------------
router.post('/signup', async (req, res) => {
    const { email, user_name, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'メールアドレスとパスワードは必須です。' });
    }

    try {
        // パスワードをハッシュ化
        const passwordHash = await bcrypt.hash(password, 10); 
        const [result] = await db.query(
            'INSERT INTO users (email, user_name, password_hash) VALUES (?, ?, ?)',
            [email, user_name, passwordHash]
        );

        res.status(201).json({ 
            message: 'ユーザー登録が完了しました。',
            userId: result.insertId
        });
    } catch (error) {
        // MySQLのエラーコード 'ER_DUP_ENTRY' はメールアドレス重複を意味します
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'このメールアドレスは既に登録されています。' });
        }
        console.error('サインアップエラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// ------------------------------------------------
// POST /api/auth/login (ログイン)
// ------------------------------------------------
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // メールアドレスでユーザーを検索
        const [users] = await db.query(
            'SELECT id, password_hash, user_name FROM users WHERE email = ?',
            [email]
        );

        const user = users[0];
        if (!user) {
            // ユーザーが見つからない場合は、セキュリティのため「パスワードが違う」と同じエラーを返す
            return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません。' });
        }

        // 入力されたパスワードとDBのハッシュを比較
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません。' });
        }

        // 認証成功: トークン（JWT）を生成
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' } // トークンの有効期限を1日間に設定
        );

        // トークンとユーザー情報をクライアントに返す
        res.status(200).json({
            token: token,
            user: { id: user.id, user_name: user.user_name }
        });

    } catch (error) {
        console.error('ログインエラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});


module.exports = router;