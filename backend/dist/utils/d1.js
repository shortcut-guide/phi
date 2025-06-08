import { SEARCHLOGS_DB, PROFILE_DB, PRODUCTS_DB } from "@/b/config/env";
let DB;
// Cloudflare D1 に接続するクライアントを取得する
export const getD1SearchLogs = () => {
    // @ts-ignore - D1 は Cloudflare Worker 上で自動でバインドされる
    DB = SEARCHLOGS_DB;
    if (!DB)
        throw new Error("D1 クライアントがバインドされていません (SEARCHLOGS_DB が未定義)");
    return DB;
};
export const getD1UserProfile = () => {
    // @ts-ignore - D1 は Cloudflare Worker 上で自動でバインドされる
    DB = PROFILE_DB;
    if (!DB)
        throw new Error("D1 クライアントがバインドされていません (PROFILE_DB が未定義)");
    return DB;
};
export const getD1Product = () => {
    // @ts-ignore - D1 は Cloudflare Worker 上で自動でバインドされる
    DB = PRODUCTS_DB;
    if (!DB)
        throw new Error("D1 クライアントがバインドされていません (PRODUCTS_DB が未定義)");
    return DB;
};
