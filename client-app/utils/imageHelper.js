import { SERVER_URL } from '../config';

/**
 * 画像パスを受け取り、完全なURLを返します。
 * DBに保存された相対パスと、サーバーのベースURLを結合します。
 * 既に完全なURL（古いデータなど）の場合はそのまま返します。
 * 
 * @param {string} path - DBから取得した画像のパス (例: "uploads/image.jpg")
 * @returns {string|null} - 完全なURL または null
 */
export const getImageUrl = (path) => {
    if (!path) return null;
    
    // 既に完全なURLの場合はそのまま返す (古いデータとの互換性)
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // 相対パスの場合はSERVER_URLと結合
    // pathの先頭にスラッシュがある場合を取り除く
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    return `${SERVER_URL}/${cleanPath}`;
};

