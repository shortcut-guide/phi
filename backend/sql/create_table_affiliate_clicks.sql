-- backend/sql/create_table_affiliate_clicks.sql
-- Cloudflare D1 (SQLite互換) 用のクリックトラッキングテーブル

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id TEXT PRIMARY KEY,                  -- click_id (UUID)
  user_id TEXT NULL,                    -- ログインユーザーID（あれば）
  asin TEXT NULL,                       -- Amazon ASIN
  shop TEXT NULL,                       -- shop 名（例: amazon）
  tracking_id TEXT NULL,                -- アフィリエイトのタグ値等
  target_url TEXT NOT NULL,             -- 実際の遷移先URL
  referer TEXT NULL,                     -- リファラ
  ip TEXT NULL,                          -- 取得可能なIP
  user_agent TEXT NULL,                  -- UA
  meta JSON NULL,                        -- 将来用の拡張メタ情報
  clicked_at INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER)), -- Unix epoch seconds
  matched INTEGER NOT NULL DEFAULT 0,    -- 購入と照合できたか (0/1)
  matched_at INTEGER NULL,               -- 照合時刻
  order_id TEXT NULL                     -- Amazon側の注文ID等（あれば）
);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user_id ON affiliate_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_asin ON affiliate_clicks(asin);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_matched ON affiliate_clicks(matched);
