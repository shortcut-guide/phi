import { D1Database } from '@cloudflare/workers-types';
import { messages } from "@/b/config/messageConfig";
import { getLang } from "@/b/utils/lang";

import { SITE_DB, SEARCHLOGS_DB, PROFILE_DB, PRODUCTS_DB } from "@/b/config/env";

const lang = getLang();
const t = messages.utilsD1?.[lang];

let DB: D1Database;

// Cloudflare D1 に接続するクライアントを取得する
export const getD1Site = (): D1Database => {
  // @ts-ignore - D1 は Cloudflare Worker 上で自動でバインドされる
  DB = SITE_DB;
  if (!DB) throw new Error(t.ErrorSITE_DB);
  return DB;
};

export const getD1SearchLogs = (): D1Database => {
  // @ts-ignore - D1 は Cloudflare Worker 上で自動でバインドされる
  DB = SEARCHLOGS_DB;
  if (!DB) throw new Error(t.ErrorSEARCHLOGS_DB);
  return DB;
};

export const getD1UserProfile = (): D1Database => {
  // @ts-ignore - D1 は Cloudflare Worker 上で自動でバインドされる
  DB = PROFILE_DB;
  if (!DB) throw new Error(t.ErrorPROFILE_DB);
  return DB;
};

export const getD1Product = (): D1Database => {
  // @ts-ignore - D1 は Cloudflare Worker 上で自動でバインドされる
  DB = PRODUCTS_DB;
  if (!DB) throw new Error(t.ErrorPRODUCTS_DB);
  return DB;
};