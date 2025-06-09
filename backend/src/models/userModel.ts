import type { UserProfile } from '@/b/types/userProfile';

export async function isUserVerified(DB: D1Database, {user_id}: UserProfile): Promise<boolean> {
  const result = await DB.prepare(
    `SELECT is_verified FROM users WHERE id = ?`
  ).bind(user_id).first();
  return result?.is_verified === 1;
}
