import { DB } from "@/b/config/db";

export async function updateVerifiedStatus(email: string) {
  return await DB.prepare("UPDATE users SET verified = 1 WHERE email = ?")
    .bind(email)
    .run();
}

export async function getVerifiedStatus(userId: string) {
  const result = await DB.prepare("SELECT verified FROM users WHERE id = ?")
    .bind(userId)
    .first();
  return result?.verified === 1;
}
