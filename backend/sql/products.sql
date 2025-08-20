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

-- FTS5 仮想テーブルを作成（name と ec_data を全文検索対象にする）
CREATE VIRTUAL TABLE IF NOT EXISTS products_fts USING fts5(
  name, 
  ec_data,
  tokenize = 'unicode61'
);

-- トリガー: products の変更を products_fts に反映
CREATE TRIGGER IF NOT EXISTS products_ai AFTER INSERT ON products BEGIN
  INSERT INTO products_fts(rowid, name, ec_data) VALUES (new.rowid, new.name, new.ec_data);
END;

CREATE TRIGGER IF NOT EXISTS products_ad AFTER DELETE ON products BEGIN
  -- FTS5 のドキュメント削除は特別な形式で行う
  INSERT INTO products_fts(products_fts, rowid) VALUES('delete', old.rowid);
END;

CREATE TRIGGER IF NOT EXISTS products_au AFTER UPDATE ON products BEGIN
  INSERT INTO products_fts(products_fts, rowid) VALUES('delete', old.rowid);
  INSERT INTO products_fts(rowid, name, ec_data) VALUES (new.rowid, new.name, new.ec_data);
END;