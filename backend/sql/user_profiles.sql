-- ユーザープロフィール
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id TEXT PRIMARY KEY,
  nickname TEXT,
  bio TEXT,
  avatar_url TEXT,
  verified INTEGER DEFAULT 0,
  verified_at TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 外部アカウント連携（PayPalなど）
CREATE TABLE IF NOT EXISTS external_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  external_user_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TEXT,
  linked_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
);

-- 認証トークン（PayPal OAuth連携中の一時データ）
CREATE TABLE IF NOT EXISTS verify_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_verify_tokens_user_id ON verify_tokens(user_id);