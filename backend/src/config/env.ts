// backend/src/config/env.ts
import { config } from 'dotenv';
import { resolve } from 'path';

// 環境に応じた .env ファイルを選択
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'develop',
  WRANGLER_CONFIG: process.env.WRANGLER_CONFIG || 'wrangler-develop.toml',
}
const envFile = resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);

// .env ファイルを読み込む
config({ path: envFile });

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const PORT = process.env.PORT || 3000;