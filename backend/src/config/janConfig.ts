export const JAN_API_URL = process.env.JAN_API_URL!;

if (!JAN_API_URL) throw new Error('環境変数 JAN_API_URL が設定されていません');