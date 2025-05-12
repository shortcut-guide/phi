import { D1Database } from '@cloudflare/workers-types';
import { SEARCHLOGS_DB, PROFILE_DB, PRODUCTS_DB } from "@/b/config/env";

let DB: D1Database;

// Cloudflare D1 に接続するクライアントを取得する
export const getD1SearchLogs = (): D1Database => {
  // @ts-ignore - D1 は Cloudflare Worker 上で自動でバインドされる
  DB = SEARCHLOGS_DB;
  if (!DB) throw new Error("D1 クライアントがバインドされていません (SEARCHLOGS_DB が未定義)");
  return DB;
};

export const getD1UserProfile = (): D1Database => {
  // @ts-ignore - D1 は Cloudflare Worker 上で自動でバインドされる
  DB = PROFILE_DB;
  if (!DB) throw new Error("D1 クライアントがバインドされていません (PROFILE_DB が未定義)");
  return DB;
};

export const getD1Product = (): D1Database => {
  // @ts-ignore - D1 は Cloudflare Worker 上で自動でバインドされる
  DB = PRODUCTS_DB;
  if (!DB) throw new Error("D1 クライアントがバインドされていません (PRODUCTS_DB が未定義)");
  return DB;
};