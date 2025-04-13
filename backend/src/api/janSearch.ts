// src/api/janSearch.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { jan } = req.query;

  if (!jan) return res.status(400).json({ error: 'JANコードが必要です' });

  try {
    const response = await fetch(`https://www.jancode.xyz/api/jan/${jan}`);
    const data = await response.json();

    if (!data || !data.name) return res.status(404).json({ error: '商品が見つかりませんでした' });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: '検索エラー' });
  }
}