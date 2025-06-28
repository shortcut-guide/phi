// backend/src/controllers/searchController.ts
import { Context } from 'hono';
import { findSuggestedKeywords } from '@/b/models/SearchLog';
import {
  insertSearchLog,
  insertClickLog,
  getPopularKeywords
} from '@/b/services/searchService';

export async function Search(c: Context): Promise<Response> {
  const q = c.req.query('q')?.trim();
  const uid = c.req.query('uid')?.trim();

  if (!q) {
    return c.text('Missing query', 400);
    return;
  }

  await insertSearchLog(q, uid ?? null);
  res.json([]);
}

export async function ClickLog(c: Context): Promise<Response> {
  const body = await c.req.json();
  const { keyword, user_id, product_id } = body;

  if (!keyword || !product_id) return c.text('Missing keyword or product_id', 400);
  await insertClickLog(keyword, user_id ?? 'anonymous', product_id);
  return c.text('OK', 200);
}

export async function Analytics(c: Context): Promise<Response> {
  const result = await getPopularKeywords();
  return c.json(result, 200);
}

export async function Suggest(c: Context): Promise<Response> {
  const prefix = c.req.query('prefix')?.trim();
  if (!prefix) return c.text('Missing prefix', 400);
  const suggestions = await findSuggestedKeywords(prefix);
  return c.json(suggestions, 200);
}
