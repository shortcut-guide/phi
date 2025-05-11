CREATE TABLE user_profiles (
  user_id TEXT PRIMARY KEY,            -- 内部ユーザーID（UUID等）
  nickname TEXT,                       -- 表示名
  bio TEXT,                            -- 自己紹介
  avatar_url TEXT,                     -- プロフィール画像
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE external_accounts (
  id TEXT PRIMARY KEY,                 -- 内部ID
  user_id TEXT NOT NULL,               -- user_profiles.user_id と紐づけ
  provider TEXT NOT NULL,              -- 例: 'paypal', 'google', 'line'
  external_user_id TEXT NOT NULL,      -- PayPalなどの外部ID
  access_token TEXT,                   -- OAuthアクセストークン（必要であれば）
  refresh_token TEXT,                  -- リフレッシュトークン（必要であれば）
  expires_at TEXT,                     -- トークン有効期限
  linked_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
);