export async function isUserVerified(DB: D1Database, userId: string): Promise<boolean> {
  const result = await DB.prepare(`SELECT is_verified FROM users WHERE id = ?`)
    .bind(userId)
    .first<{ is_verified: number }>();
  return result?.is_verified === 1;
}
