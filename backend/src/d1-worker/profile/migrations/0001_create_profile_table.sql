-- Migration number: 0001 	 2025-05-20T12:59:14.917Z
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id TEXT PRIMARY KEY,
  nickname TEXT,
  bio TEXT,
  avatar_url TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);