export const BASE_API_URL = process.env.BASE_API_URL!;
export const BASE_API_KEY = process.env.BASE_API_KEY!;
export const BASE_API_CLIENT_ID = process.env.BASE_API_CLIENT_ID!;
export const BASE_API_CLIENT_SECRET = process.env.BASE_API_CLIENT_SECRET!;

if (!BASE_API_URL) throw new Error('環境変数 BASE_API_URL が設定されていません');
if (!BASE_API_KEY) throw new Error('環境変数 BASE_API_KEY が設定されていません');
if (!BASE_API_CLIENT_ID) throw new Error('環境変数 BASE_API_CLIENT_ID が設定されていません');
if (!BASE_API_CLIENT_SECRET) throw new Error('環境変数 BASE_API_CLIENT_SECRET が設定されていません');