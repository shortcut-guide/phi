-- 新テーブル作成
CREATE TABLE products_new (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  platform TEXT NOT NULL,
  base_price INTEGER,
  ec_data TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- データ移行
INSERT INTO products_new (id, name, shop_name, platform, base_price, ec_data, created_at, updated_at)
SELECT id, name, shop_name, platform, base_price, ec_data, created_at, updated_at FROM products;

-- 元テーブル削除
DROP TABLE products;

-- テーブル名変更
ALTER TABLE products_new RENAME TO products;