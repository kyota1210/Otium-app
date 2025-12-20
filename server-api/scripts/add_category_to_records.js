const db = require('../db');

async function addCategoryToRecords() {
    try {
        console.log('Adding category_id column to records table...');
        
        // カラムが存在するか確認
        const checkSql = `
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'records'
            AND COLUMN_NAME = 'category_id';
        `;
        
        const [rows] = await db.query(checkSql);
        
        if (rows.length > 0) {
            console.log('category_id column already exists in records table. Skipping.');
            return;
        }

        // カラム追加SQL
        const addColumnSql = `
            ALTER TABLE records 
            ADD COLUMN category_id INT DEFAULT NULL;
        `;
        
        await db.query(addColumnSql);
        console.log('Successfully added category_id column.');

        // 外部キー制約を追加
        const addForeignKeySql = `
            ALTER TABLE records 
            ADD CONSTRAINT fk_records_category
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
        `;
        
        await db.query(addForeignKeySql);
        console.log('Successfully added foreign key constraint.');
        
    } catch (error) {
        console.error('Failed to modify records table:', error);
    } finally {
        process.exit();
    }
}

addCategoryToRecords();
