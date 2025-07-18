import { redis } from '@/b/utils/redis';
import type { Request, Response } from 'express';

// 検索ワード入力
export const logSearchInput = async (req: Request, res: Response) => {
  const { keyword, session_id } = req.body;
  if (!keyword) return res.status(400).json({ error: 'Invalid payload' });
  await redis.lpush(`search:input:${session_id ?? 'anon'}`, JSON.stringify({ keyword, ts: Date.now() }));
  res.json({ success: true });
};

// 検索ワード＋検索結果クリック
export const logSearchResultClick = async (req: Request, res: Response) => {
  const { keyword, clicked_product_id, session_id } = req.body;
  if (!keyword || !clicked_product_id) return res.status(400).json({ error: 'Invalid payload' });
  await redis.lpush(`search:result_click:${session_id ?? 'anon'}`, JSON.stringify({ keyword, clicked_product_id, ts: Date.now() }));
  res.json({ success: true });
};

// 商品クリック（既存）
export const logClick = async (req: Request, res: Response) => {
  const { clicked_product_id } = req.body;
  if (!clicked_product_id) return res.status(400).json({ error: 'Invalid payload' });
  await redis.incr(`clickcount:${clicked_product_id}`);
  res.json({ success: true });
};