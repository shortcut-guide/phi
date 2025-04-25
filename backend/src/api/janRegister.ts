/*
  APIエンドポイント（JAN検索 + BASE登録）
*/
import type { NextApiRequest, NextApiResponse } from 'next';
import { JAN_API_URL } from '../config/janConfig.ts';
import { registerProductToBASE } from '../services/baseJancode.ts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { jan } = req.query;
  if (!jan) return res.status(400).json({ error: 'JANコードが必要です' });

  const response = await fetch(`${JAN_API_URL}${jan}`);
  const product: { name?: string; maker?: string; price?: number } = await response.json();

  if (!product?.name) {
    return res.status(404).json({ error: '商品が見つかりませんでした' });
  }

  try {
    const registered = await registerProductToBASE({
      name: product.name,
      maker: product.maker ?? '不明',
      price: product.price ?? 0,
    });
    return res.status(200).json(registered);
  } catch (err) {
    return res.status(500).json({ error: 'BASE登録に失敗しました' });
  }
}