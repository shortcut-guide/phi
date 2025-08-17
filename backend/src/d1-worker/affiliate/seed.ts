import type { D1Database } from '@cloudflare/workers-types';

export async function seedAffiliateExample(db: D1Database) {
  // サンプルデータ（必要に応じて削除）
  await db.prepare(
    `INSERT OR IGNORE INTO affiliate_clicks (id, user_id, asin, shop, target_url, ip, user_agent, clicked_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run('sample-click-1', 'user-1', 'B00EXAMPLE', 'amazon', 'https://www.amazon.co.jp/dp/B00EXAMPLE', '127.0.0.1', 'seed-agent', Math.floor(Date.now() / 1000));
}
