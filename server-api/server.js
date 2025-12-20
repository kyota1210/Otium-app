const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./authRoutes'); 
const recordsRoutes = require('./recordsRoutes');
const userRoutes = require('./userRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// 画像ファイルの公開設定
// http://localhost:3000/uploads/filename.jpg でアクセス可能になります
app.use('/uploads', express.static('uploads'));

// 接続テストルート
app.get('/api/test-db', async (req, res) => {
    try {
        // データベースにシンプルなクエリを実行
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        console.log('DB Connection Success:', rows[0].solution);
        res.status(200).json({ 
            message: 'データベース接続に成功しました！', 
            solution: rows[0].solution 
        });
    } catch (error) {
        console.error('データベース接続エラー:', error);
        res.status(500).json({ 
            message: 'データベース接続エラーが発生しました。', 
            error: error.message 
        });
    }
});

// 認証ルート (認証不要)
app.use('/api/auth', authRoutes);

// 記録ルート (認証が必要)
app.use('/api/records', recordsRoutes);

// ユーザールート (認証が必要)
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});