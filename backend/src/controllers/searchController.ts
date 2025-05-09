// backend/src/controllers/searchController.ts
import { Request, Response } from 'express';
import { findSuggestedKeywords } from '@/b/models/SearchLog';
import {
  insertSearchLog,
  insertClickLog,
  getPopularKeywords
} from '@/b/services/searchService';

export const handleSearch = async (req: Request, res: Response) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : null;
  const uid = typeof req.query.uid === 'string' ? req.query.uid.trim() : null;

  if (!q) return res.status(400).send('Missing query');

  await insertSearchLog(q, uid);

  // 検索処理は別途。仮に空配列を返す。
  return res.json([]);
};

export const handleClickLog = async (req: Request, res: Response) => {
  const { keyword, user_id, product_id } = req.body;

  if (!keyword || !product_id) {
    return res.status(400).send('Missing keyword or product_id');
  }

  await insertClickLog(keyword, user_id ?? 'anonymous', product_id);
  return res.status(200).send('OK');
};

export const handleAnalytics = async (_req: Request, res: Response) => {
  const result = await getPopularKeywords();
  return res.status(200).json(result);
};

export const handleSuggest = async (req: Request, res: Response) => {
  const prefix = typeof req.query.prefix === 'string' ? req.query.prefix.trim() : null;
  if (!prefix) return res.status(400).send('Missing prefix');

  const suggestions = await findSuggestedKeywords(prefix);
  return res.status(200).json(suggestions);
};
