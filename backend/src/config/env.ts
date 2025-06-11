// backend/src/config/env.ts
import { config } from 'dotenv';
import { resolve } from 'path';

// 環境に応じた .env ファイルを選択
const ENV = process.env.NODE_ENV || 'develop';
const envFile = resolve(process.cwd(), `.env.${ENV}`);

// .env ファイルを読み込む
config({ path: envFile });

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = ENV;
export const SITE_DB = required("CLOUDFLARE_D1_DATABASE_SITES");
export const SEARCHLOGS_DB = required("CLOUDFLARE_D1_DATABASE_SEARCH_LOGS");
export const PRODUCTS_DB = required("CLOUDFLARE_D1_DATABASE_PRODUCTS");
export const PROFILE_DB = required("CLOUDFLARE_D1_DATABASE_PROFILE");
export const PUP_DB = required("CLOUDFLARE_D1_DATABASE_PUP");
export const PAYPAL_CLIENT_ID = required("PAYPAL_CLIENT_ID");
export const PAYPAL_SECRET = required("PAYPAL_SECRET");
export const PAYPAL_API_BASE = required("PAYPAL_API_BASE");
export const IMGUR_CLIENT_ID = required("IMGUR_CLIENT_ID");