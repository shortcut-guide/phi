import puppeteer from 'puppeteer';
import { getToken, saveToken, updateToken, deleteToken, isTokenExpired } from './tokenService';

const scrape = async () => {
  const token = await getToken();

  // トークンが存在し、期限切れでない場合はそのまま返す
  if (token && !isTokenExpired(token.expires_at)) {
    console.log('✅ 有効なトークンを使用中');
    return token;
  }
  console.log('🔁 認可コードを再取得');
  
  const browser = await puppeteer.launch({ headless: true, slowMo: 100 });
  const page = await browser.newPage();
  const authUrl = `${process.env.BASE_API_URL}/1/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${process.env.CALLBACK}&scope=read_users%20read_orders&state=${process.env.STATE}`;
  
  // 認証ページに移動
  await page.goto(authUrl, { waitUntil: 'domcontentloaded' });
  await page.type('#UserMailAddress', process.env.EMAIL);
  await page.type('#UserPassword', process.env.PASSWORD);
  await page.click('.submitBtn');
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  const currentUrl = page.url();
  const urlParams = new URL(currentUrl).searchParams;
  const authCode = urlParams.get('code');

  await browser.close();

  if (!authCode) throw new Error('❌ 認可コード取得失敗');

  const tokenRes = await fetch(`${BASE_API_URL}/1/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: authCode,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.CALLBACK,
    }),
  });
  
  const tokenData = await tokenRes.json();

  // 30日後
  const expiresAt = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

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