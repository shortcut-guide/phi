import type { D1Database } from '@cloudflare/workers-types';

export async function createAffiliateTables(db: D1Database) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS affiliate_clicks (
      id TEXT PRIMARY KEY,
      user_id TEXT NULL,
      asin TEXT NULL,
      shop TEXT NULL,
      tracking_id TEXT NULL,
      target_url TEXT NOT NULL,
      referer TEXT NULL,
      ip TEXT NULL,
      user_agent TEXT NULL,
      meta JSON NULL,
      clicked_at INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER)),
      matched INTEGER NOT NULL DEFAULT 0,
      matched_at INTEGER NULL,
      order_id TEXT NULL
    );
  `).run();

  await db.prepare('CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user_id ON affiliate_clicks(user_id);').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_asin ON affiliate_clicks(asin);').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at);').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_matched ON affiliate_clicks(matched);').run();
}
