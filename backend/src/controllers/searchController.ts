// backend/src/controllers/searchController.ts
import type { Request, Response } from 'express';
import { findSuggestedKeywords } from '@/b/models/SearchLog';
import {
  insertSearchLog,
  insertClickLog,
  getPopularKeywords
} from '@/b/services/searchService';

export async function Search(req: Request, res: Response) {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : null;
  const uid = typeof req.query.uid === 'string' ? req.query.uid.trim() : null;

  if (!q) {
    res.status(400).send('Missing query');
    return;
  }

  await insertSearchLog(q, uid);
  res.json([]);
}

export async function ClickLog(req: Request, res: Response) {
  const { keyword, user_id, product_id } = req.body;

  if (!keyword || !product_id) {
    res.status(400).send('Missing keyword or product_id');
    return;
  }

  await insertClickLog(keyword, user_id ?? 'anonymous', product_id);
  res.status(200).send('OK');
}

export async function Analytics(req: Request, res: Response) {
  const result = await getPopularKeywords();
  res.status(200).json(result);
}

export async function Suggest(req: Request, res: Response) {
  const prefix = typeof req.query.prefix === 'string' ? req.query.prefix.trim() : null;
  if (!prefix) {
    res.status(400).send('Missing prefix');
    return;
  }

  const suggestions = await findSuggestedKeywords(prefix);
  res.status(200).json(suggestions);
}
