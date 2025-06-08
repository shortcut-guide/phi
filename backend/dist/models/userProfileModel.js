import { getD1UserProfile } from "@/b/utils/d1";
export async function getUserProfile(user_id) {
    const DB = getD1UserProfile();
    const result = await DB.prepare(`SELECT * FROM user_profiles WHERE user_id = ?`).bind(user_id).run();
    return result.results;
}
;
export async function upsertUserProfile({ user_id, nickname, bio, avatar_url }) {
    const DB = getD1UserProfile();
    const result = await DB.prepare(`
    INSERT INTO user_profiles (user_id, nickname, bio, avatar_url)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      nickname = excluded.nickname,
      bio = excluded.bio,
      avatar_url = excluded.avatar_url,
      updated_at = CURRENT_TIMESTAMP
  `).bind(user_id, nickname, bio, avatar_url).run();
    return result.results;
}
;
