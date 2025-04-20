import puppeteer from 'puppeteer';
import { getToken, saveToken, updateToken, deleteToken, isTokenExpired } from '../services/tokenService';

const scrape = async () => {

  const email = process.env.BASE_EMAIL ?? (() => { throw new Error('環境変数 EMAIL が設定されていません'); })();
  const password = process.env.BASE_PASSWORD ?? (() => { throw new Error('環境変数 PASSWORD が設定されていません'); })();
  const baseApiUrl = process.env.BASE_API_URL ?? (() => { throw new Error('環境変数 BASE_API_URL が設定されていません'); })();
  const clientId = process.env.BASE_CLIENT_ID ?? (() => { throw new Error('環境変数 CLIENT_ID が設定されていません'); })();
  const clientSecret = process.env.BASE_CLIENT_SECRET ?? (() => { throw new Error('環境変数 CLIENT_SECRET が設定されていません'); })();
  const callback = process.env.BASE_CALLBACK ?? (() => { throw new Error('環境変数 CALLBACK が設定されていません'); })();
  const state = process.env.BASE_STATE ?? (() => { throw new Error('環境変数 STATE が設定されていません'); })();
  const token = await getToken();

  // トークンが存在し、期限切れでない場合はそのまま返す
  if (token && !isTokenExpired(token.expires_at)) {
    console.log('✅ 有効なトークンを使用中');
    return token;
  }
  console.log('🔁 認可コードを再取得');
  
  const browser = await puppeteer.launch({ headless: true, slowMo: 100 });
  const page = await browser.newPage();
  const authUrl = `${baseApiUrl}/1/oauth/authorize?response_type=code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${callback}&scope=read_users%20read_orders&state=${state}`;
  
  // 認証ページに移動
  await page.goto(authUrl, { waitUntil: 'domcontentloaded' });
  await page.type('#UserMailAddress', email);
  await page.type('#UserPassword', password);
  await page.click('.submitBtn');
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  const currentUrl = page.url();
  const urlParams = new URL(currentUrl).searchParams;
  const authCode = urlParams.get('code');

  await browser.close();

  if (!authCode) throw new Error('❌ 認可コード取得失敗');

  const tokenRes = await fetch(`${baseApiUrl}/1/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: authCode,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callback,
    }),
  });
  
  const tokenData = await tokenRes.json();

  // 30日後
  const expiresAt = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  if (!tokenData.access_token) {
    throw new Error('❌ トークン取得失敗');
  }
  console.log('✅ トークン取得成功');
  
  // トークンをDBに保存
  const newToken = {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expires_at: expiresAt,
  };

  // DBからトークンを取得
  if (token) {
    console.log('📝 既存トークンを更新');
    await updateToken(newToken);
  } else {
    console.log('💾 新規トークンを保存');
    await saveToken(newToken);
  }

  return tokenData;
};

// DBからトークンを取得
export const deleteBaseToken = async () => {
  await deleteToken();
  console.log('🗑️ トークン削除完了');
};