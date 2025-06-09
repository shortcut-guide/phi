DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id TEXT PRIMARY KEY,             -- 商品ID
  name TEXT NOT NULL,              -- 商品名
  shop_name TEXT NOT NULL,         -- 販売元名（例：自社公式, ABC商店）
  platform TEXT NOT NULL,          -- プラットフォーム（例：amazon, rakuten, base）
  base_price INTEGER,              -- 参考価格
  ec_data TEXT NOT NULL,           -- 各EC用詳細データ(JSON)
  own BOOLEAN DEFAULT 0,           -- 自社商品かどうか
  created_at TEXT DEFAULT CURRENT_TIMESTAMP, 
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP  -- 最終更新日時
);