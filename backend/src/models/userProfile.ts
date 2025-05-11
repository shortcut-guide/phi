// backend/src/models/userProfile.ts
import { v4 as uuidv4 } from 'uuid';
import { getD1UserProfile } from '@/b/utils/d1';

export const getUserProfile = async (userId: string) => {
  const id = uuidv4();
  const db = getD1UserProfile();
  await db.prepare(
    `SELECT * FROM user_profiles WHERE user_id = ?`
  ).bind(userId).run();
};

export const upsertUserProfile = async (userId: string, nickname: string, bio: string, avatarUrl: string) => {
  return await DB.prepare(`
    INSERT INTO user_profiles (user_id, nickname, bio, avatar_url)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      nickname = excluded.nickname,
      bio = excluded.bio,
      avatar_url = excluded.avatar_url,
      updated_at = CURRENT_TIMESTAMP
  `).bind(userId, nickname, bio, avatarUrl).run();
};