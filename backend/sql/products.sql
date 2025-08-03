DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id TEXT PRIMARY KEY,             -- 商品ID
  name TEXT NOT NULL,              -- 商品名
  platform TEXT NOT NULL,          -- プラットフォーム（例：amazon, rakuten, base）
  price INTEGER,                   -- 参考価格
  ec_data TEXT NOT NULL,           -- 各EC用詳細データ(JSON)
  created_at TEXT DEFAULT CURRENT_TIMESTAMP, 
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP  -- 最終更新日時
);