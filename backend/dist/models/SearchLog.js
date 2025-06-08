// backend/src/models/SearchLog.ts
import { v4 as uuidv4 } from 'uuid';
import { getD1SearchLogs } from "@/b/utils/d1";
export const insertSearchLog = async (keyword, user_id) => {
    const id = uuidv4();
    const DB = getD1SearchLogs();
    const result = await DB.prepare(`
    INSERT INTO search_logs (id, keyword, user_id)
    VALUES (?, ?, ?)
  `).bind(id, keyword, user_id).run();
    return result.results;
};
export const insertClickLog = async (keyword, user_id, product_id) => {
    const id = uuidv4();
    const DB = getD1SearchLogs();
    const result = await DB.prepare(`
    INSERT INTO search_logs (id, keyword, user_id, clicked_product_id)
    VALUES (?, ?, ?, ?)
  `).bind(id, keyword, user_id, product_id).run();
    return result.results;
};
export const getPopularKeywords = async () => {
    const DB = getD1SearchLogs();
    const result = await DB.prepare(`
    SELECT keyword, COUNT(*) as count
    FROM search_logs
    GROUP BY keyword
    ORDER BY count DESC
    LIMIT 10
  `).all();
    return result.results;
};
export const findSuggestedKeywords = async (prefix) => {
    const DB = getD1SearchLogs();
    const result = await DB.prepare(`
    SELECT DISTINCT keyword FROM search_logs
    WHERE keyword LIKE ?
    ORDER BY created_at DESC
    LIMIT 10
  `).bind(`${prefix}%`).all();
    return result.results.map((row) => row.keyword);
};
