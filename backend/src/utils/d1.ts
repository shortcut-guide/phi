import { D1Database } from '@cloudflare/workers-types';

let d1Client: D1Database;

export const getDB = (env: any) => env.CLOUDFLARE_D1_DATABASE_PRODUCTS;

// Cloudflare D1 に接続するクライアントを取得する
export const getD1SearchLogs = (): D1Database => {
  if (!d1Client) {
    // @ts-ignore - D1 は Cloudflare Worker 上で自動でバインドされる
    d1Client = globalThis.env.CLOUDFLARE_D1_DATABASE_SEARCH_LOGS;
    if (!d1Client) {
      throw new Error("D1 クライアントがバインドされていません (globalThis.env.DB が未定義)");
    }
  }
  return d1Client;
};