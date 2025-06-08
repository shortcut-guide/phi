/// <reference types="@cloudflare/workers-types" />
// D1 クエリラッパー
export const getToken = async (db) => {
    return await db.prepare('SELECT * FROM oauth_tokens ORDER BY id DESC LIMIT 1').first();
};
export const saveToken = async (db, token) => {
    await db
        .prepare(`INSERT INTO oauth_tokens (access_token, refresh_token, expires_at) VALUES (?, ?, ?)`)
        .bind(token.access_token, token.refresh_token, token.expires_at)
        .run();
};
export const updateToken = async (db, token) => {
    await db
        .prepare(`UPDATE oauth_tokens SET access_token = ?, refresh_token = ?, expires_at = ? WHERE id = (SELECT id FROM oauth_tokens ORDER BY id DESC LIMIT 1)`)
        .bind(token.access_token, token.refresh_token, token.expires_at)
        .run();
};
export const deleteToken = async (db) => {
    await db.prepare(`DELETE FROM oauth_tokens`).run();
};
