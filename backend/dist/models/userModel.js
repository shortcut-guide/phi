import { getD1UserProfile } from "@/b/utils/d1";
export async function isUserVerified({ user_id }) {
    const DB = getD1UserProfile();
    const result = await DB.prepare(`SELECT is_verified FROM users WHERE id = ?`).bind(user_id).first();
    return result?.is_verified === 1;
}
