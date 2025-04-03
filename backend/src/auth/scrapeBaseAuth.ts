import puppeteer from 'puppeteer';
import { getToken, saveToken, updateToken, deleteToken, isTokenExpired } from '../services/tokenService';
import { fetchVerificationCode } from '../utils/fetchVerificationCode';
import { BASE_AUTH_URL, BASE_TOKEN_URL } from '../config/baseConfig';
import 'dotenv/config';

export const scrapeBaseAuth = async () => {

  const email = process.env.EMAIL ?? (() => { throw new Error('環境変数 EMAIL が設定されていません'); })();
  const password = process.env.PASSWORD ?? (() => { throw new Error('環境変数 PASSWORD が設定されていません'); })();
  const baseApiUrl = process.env.BASE_API_URL ?? (() => { throw new Error('環境変数 BASE_API_URL が設定されていません'); })();
  const clientId = process.env.CLIENT_ID ?? (() => { throw new Error('環境変数 CLIENT_ID が設定されていません'); })();
  const clientSecret = process.env.CLIENT_SECRET ?? (() => { throw new Error('環境変数 CLIENT_SECRET が設定されていません'); })();
  const callback = process.env.CALLBACK ?? (() => { throw new Error('環境変数 CALLBACK が設定されていません'); })();
  const state = process.env.STATE ?? (() => { throw new Error('環境変数 STATE が設定されていません'); })();
  const token = await getToken();

  const token = await getTokenFromDB();

  if (token && !isTokenExpired(token.expires_at)) {
    console.log('✅ 有効なトークンを使用中');
    return token;
  }

  console.log('🔁 認可コードを再取得中...');

  const browser = await puppeteer.launch({ headless: true, slowMo: 100 });
  const page = await browser.newPage();

  const authUrl = `${BASE_AUTH_URL}?response_type=code&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${process.env.CALLBACK}&scope=read_users%20read_orders&state=hogehoge`;
  await page.goto(authUrl, { waitUntil: 'domcontentloaded' });

  await page.type('#UserMailAddress', process.env.EMAIL);
  await page.type('#UserPassword', process.env.PASSWORD);
  await page.click('.submitBtn');

  await page.waitForSelector('#AuthCodeInput', { timeout: 10000 });

  const verificationCode = await fetchVerificationCode();
  await page.type('#AuthCodeInput', verificationCode);
  await page.click('#SubmitButton');

  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  const currentUrl = page.url();
  const urlParams = new URL(currentUrl).searchParams;
  const authCode = urlParams.get('code');
  await browser.close();

  if (!authCode) throw new Error('❌ 認可コード取得失敗');

  const tokenRes = await fetch(BASE_TOKEN_URL, {
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

  const expiresAt = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  const newToken = {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expires_at: expiresAt,
  };

  if (token) {
    await updateTokenToDB(newToken);
  } else {
    await saveTokenToDB(newToken);
  }

  return tokenData;
};