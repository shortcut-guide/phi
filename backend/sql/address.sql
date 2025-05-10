CREATE TABLE user_addresses (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT,
  kana TEXT,
  zip TEXT,
  address TEXT,
  is_default INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
