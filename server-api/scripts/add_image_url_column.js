const db = require('../db');

async function addImageUrlColumn() {
    try {
        console.log('Adding image_url column to records table...');
        
        // カラムが存在するか確認（エラー回避のため）
        const checkSql = `
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'records' 
            AND COLUMN_NAME = 'image_url';
        `;
        
        const [rows] = await db.query(checkSql);
        
        if (rows.length > 0) {
            console.log('image_url column already exists. Skipping.');
            return;
        }

        const sql = `ALTER TABLE records ADD COLUMN image_url VARCHAR(255) DEFAULT NULL;`;
        await db.query(sql);
        console.log('Successfully added image_url column.');
    } catch (error) {
        console.error('Failed to add column:', error);
    } finally {
        process.exit();
    }
}

addImageUrlColumn();

