CREATE TABLE sites (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    element TEXT NOT NULL DEFAULT '{}',  -- JSON 文字列として格納
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE oauth_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  access_token TEXT,
  refresh_token TEXT,
  expires_at INTEGER, -- UNIX timestamp
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_resets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT,
  price INTEGER,
  imageUrl TEXT,
  description TEXT,
  category TEXT,
  is_own INTEGER DEFAULT 0
);