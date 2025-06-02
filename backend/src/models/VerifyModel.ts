// src/models/VerifyModel.ts
import type { VerifyToken } from "@/b/types/verify";
import { getD1UserProfile } from '@/b/utils/d1';

export async function updateVerifiedStatus(email: string) {
  const db = getD1UserProfile();
  const result = await db.prepare("UPDATE users SET verified = 1 WHERE email = ?")
    .bind(email)
    .run();
  return result.results;
}

export async function getVerifiedStatus(userId: string): Promise<boolean> {
  const db = getD1UserProfile();
  const result = await db.prepare("SELECT verified FROM users WHERE id = ?")
    .bind(userId)
    .first();
  return result?.verified === 1;
}

export async function insertVerifyToken(tokenId: string, userId: string, email: string) {
  const db = getD1UserProfile();
  const results = await db.prepare(`
    INSERT INTO verify_tokens (id, user_id, email)
    VALUES (?, ?, ?)
  `).bind(tokenId, userId, email).run();
  return results.results;
}

export async function markUserAsVerified(email: string) {
  const db = getD1UserProfile();
  const result = await db.prepare(`
    UPDATE users
    SET verified = 1,
        verified_at = CURRENT_TIMESTAMP
    WHERE email = ?
  `).bind(email).run();
  return result.results;
}

export async function getVerifyToken(tokenId: string): Promise<VerifyToken | null> {
  const db = getD1UserProfile();
  const result = await db.prepare(`
    SELECT * FROM verify_tokens WHERE id = ?
  `).bind(tokenId).first();

  return result as VerifyToken | null;
}

export async function deleteVerifyToken(tokenId: string) {
  const db = getD1UserProfile();
  const result = await db.prepare(`
    DELETE FROM verify_tokens WHERE id = ?
  `).bind(tokenId).run();
  return result.results;
}

export async function isVerificationExpired(userId: string, days: number): Promise<boolean> {
  const db = getD1UserProfile();
  const result = await db.prepare(`
    SELECT verified_at FROM users WHERE id = ?
  `).bind(userId).first();

  const verifiedAtRaw = result?.verified_at as string | undefined;
  if (!verifiedAtRaw) return true;

  const verifiedAt = new Date(verifiedAtRaw);
  const now = new Date();

  const diffDays = (now.getTime() - verifiedAt.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > days;
}

