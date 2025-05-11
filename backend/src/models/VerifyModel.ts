export async function updateVerifiedStatus(DB: D1Database, email: string) {
  return await DB.prepare("UPDATE users SET verified = 1 WHERE email = ?")
    .bind(email)
    .run();
}

export async function getVerifiedStatus(DB: D1Database, userId: string) {
  const result = await DB.prepare("SELECT verified FROM users WHERE id = ?")
    .bind(userId)
    .first();
  return result?.verified === 1;
}

export async function insertVerifyToken(DB: D1Database, tokenId: string, userId: string, email: string) {
  return await DB.prepare(`
    INSERT INTO verify_tokens (id, user_id, email)
    VALUES (?, ?, ?)
  `).bind(tokenId, userId, email).run();
}

export async function getVerifyToken(DB: D1Database, tokenId: string) {
  return await DB.prepare(`
    SELECT * FROM verify_tokens WHERE id = ?
  `).bind(tokenId).first();
}

export async function deleteVerifyToken(DB: D1Database, tokenId: string) {
  return await DB.prepare(`
    DELETE FROM verify_tokens WHERE id = ?
  `).bind(tokenId).run();
}
