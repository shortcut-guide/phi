export const BASE_API_URL = process.env.BASE_API_URL!;
export const BASE_API_KEY = process.env.BASE_API_KEY!;
export const BASE_API_CLIENT_ID = process.env.BASE_API_CLIENT_ID!;
export const BASE_API_CLIENT_SECRET = process.env.BASE_API_CLIENT_SECRET!;
export const GMAIL_USER = process.env.GMAIL_USER!;
export const GMAIL_PASS = process.env.GMAIL_PASS!;

export const FRONTEND_URL = process.env.FRONTEND_URL!;
export const REQUEST_RESET_URL = process.env.REQUEST_RESET_URL!;

if (!BASE_API_URL) throw new Error('環境変数 BASE_API_URL が設定されていません');
if (!BASE_API_KEY) throw new Error('環境変数 BASE_API_KEY が設定されていません');
if (!BASE_API_CLIENT_ID) throw new Error('環境変数 BASE_API_CLIENT_ID が設定されていません');
if (!BASE_API_CLIENT_SECRET) throw new Error('環境変数 BASE_API_CLIENT_SECRET が設定されていません');
if (!GMAIL_USER) throw new Error('環境変数 GMAIL_USER が設定されていません');
if (!GMAIL_PASS) throw new Error('環境変数 GMAIL_PASS が設定されていません');
if (!FRONTEND_URL) throw new Error('環境変数 FRONTEND_URL が設定されていません');