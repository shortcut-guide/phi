CREATE TABLE search_logs (
  id TEXT PRIMARY KEY,
  keyword TEXT NOT NULL,
  user_id TEXT,
  clicked_product_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_keyword ON search_logs(keyword);
CREATE INDEX idx_created_at ON search_logs(created_at);