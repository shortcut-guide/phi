// backend/src/services/searchService.ts
import { v4 as uuidv4 } from 'uuid';
import { getD1SearchLogs } from '@/b/utils/d1';

export const insertSearchLog = async (keyword: string, user_id: string | null) => {
  const db = getD1SearchLogs();
  await db.prepare(`
    INSERT INTO search_logs (id, keyword, user_id)
    VALUES (?, ?, ?)
  `).bind(uuidv4(), keyword, user_id).run();
};

export const insertClickLog = async (keyword: string, user_id: string, product_id: string) => {
  const db = getD1SearchLogs();
  await db.prepare(`
    INSERT INTO search_logs (id, keyword, user_id, clicked_product_id)
    VALUES (?, ?, ?, ?)
  `).bind(uuidv4(), keyword, user_id, product_id).run();
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
