/*
  キャッシュの利用:
    cachedAccessToken にアクセストークンを保存し、同じトークンを再利用します。
    トークンがキャッシュされている場合は、API リクエストを行わずにキャッシュされたトークンを返します。
    有効期限の管理:

    トークンの有効期限 (expires_in) を利用して、58分前に再取得するタイマーを設定します。
    setTimeout を使用して、期限が近づいたら自動的にトークンを再取得します。
    エラーハンドリング:

    トークン取得に失敗した場合はエラーをスローし、再取得時のエラーもログに記録します。
    他のサービスでアクセストークンを利用する場合、getAccessToken を呼び出すだけでキャッシュされたトークンを取得できます。
*/
import { BASE_API_URL, BASE_API_CLIENT_ID, BASE_API_CLIENT_SECRET } from '../config/baseConfig.ts';

let cachedAccessToken: string | null = null;
let tokenExpiryTimeout: NodeJS.Timeout | null = null;

export const getAccessToken = async (): Promise<string> => {
  // キャッシュされたアクセストークンが存在する場合はそれを返す
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  // アクセストークンを取得する
  const payload = {
    grant_type: 'client_credentials',
    client_id: BASE_API_CLIENT_ID,
    client_secret: BASE_API_CLIENT_SECRET,
  };

  const res = await fetch(`${BASE_API_URL}oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`アクセストークン取得失敗: ${error}`);
  }

  const data: { access_token: string; expires_in: number } = await res.json();

  // アクセストークンをキャッシュ
  cachedAccessToken = data.access_token;

  // 有効期限の58分前に再取得するタイマーを設定
  if (tokenExpiryTimeout) {
    clearTimeout(tokenExpiryTimeout);
  }
  tokenExpiryTimeout = setTimeout(() => {
    cachedAccessToken = null; // キャッシュをクリア
    getAccessToken().catch((err) => console.error('アクセストークンの再取得に失敗しました:', err));
  }, (data.expires_in - 120) * 1000); // 58分前に再取得 (120秒 = 2分)

  return cachedAccessToken;
};