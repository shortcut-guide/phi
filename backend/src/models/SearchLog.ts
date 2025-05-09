// backend/src/models/SearchLog.ts
import { v4 as uuidv4 } from 'uuid';
import { getD1SearchLogs } from '@/b/utils/d1';

export const insertSearchLog = async (keyword: string, user_id: string | null) => {
  const id = uuidv4();
  const db = getD1SearchLogs();
  await db.prepare(`
    INSERT INTO search_logs (id, keyword, user_id)
    VALUES (?, ?, ?)
  `).bind(id, keyword, user_id).run();
};

export const insertClickLog = async (keyword: string, user_id: string, product_id: string) => {
  const id = uuidv4();
  const db = getD1SearchLogs();
  await db.prepare(`
    INSERT INTO search_logs (id, keyword, user_id, clicked_product_id)
    VALUES (?, ?, ?, ?)
  `).bind(id, keyword, user_id, product_id).run();
};

export const getPopularKeywords = async () => {
  const db = getD1SearchLogs();
  const result = await db.prepare(`
    SELECT keyword, COUNT(*) as count
    FROM search_logs
    GROUP BY keyword
    ORDER BY count DESC
    LIMIT 10
  `).all();
  return result.results;
};

export const findSuggestedKeywords = async (prefix: string): Promise<string[]> => {
  const db = getD1SearchLogs();
  const result = await db.prepare(`
    SELECT DISTINCT keyword FROM search_logs
    WHERE keyword LIKE ?
    ORDER BY created_at DESC
    LIMIT 10
  `).bind(`${prefix}%`).all();
  return result.results.map((row: any) => row.keyword);
};
