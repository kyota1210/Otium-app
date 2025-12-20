const db = require('../db');

async function createUserAvatarsTable() {
    try {
        console.log('Creating user_avatars table...');
        
        // テーブルが存在するか確認
        const checkSql = `
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'user_avatars';
        `;
        
        const [rows] = await db.query(checkSql);
        
        if (rows.length > 0) {
            console.log('user_avatars table already exists. Skipping.');
            return;
        }

        // テーブル作成SQL
        const createTableSql = `
            CREATE TABLE user_avatars (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL UNIQUE,
                image_url VARCHAR(500) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;
        
        await db.query(createTableSql);
        console.log('Successfully created user_avatars table.');
    } catch (error) {
        console.error('Failed to create table:', error);
    } finally {
        process.exit();
    }
}

createUserAvatarsTable();
