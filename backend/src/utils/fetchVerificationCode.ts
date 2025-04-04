import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

export const fetchVerificationCode = async (): Promise<string> => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // redirect_uri (不要でもOK)
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'subject:"認証番号" from:noreply@thebase.in',
    maxResults: 1,
  });

  const messageId = res.data.messages?.[0]?.id;
  if (!messageId) throw new Error('認証メールが見つかりません');

  const msg = await gmail.users.messages.get({ userId: 'me', id: messageId });
  if (!msg.data) throw new Error('メールの取得に失敗しました');
  if (!msg.data.payload) throw new Error('メールのペイロードがありません');
  if (!msg.data.payload.headers) throw new Error('メールのヘッダーがありません');
  if (!msg.data.payload.headers.some((header) => header.name === 'Subject')) {
    throw new Error('メールの件名がありません');
  }
  if (!msg.data.payload.headers.some((header) => header.value?.includes('認証番号'))) {
    throw new Error('メールの件名が不正です');
  }
  if (!msg.data.payload.headers.some((header) => header.name === 'From')) {
    throw new Error('メールの送信者がありません');
  }

  const payload = msg.data.payload;
  let encodedBody = '';

  // パターン1: payload.body.data に直接本文がある
  if (payload?.body?.data) {
    encodedBody = payload.body.data;
  }

  // パターン2: parts[] に含まれている場合（HTMLメール）
  if (!encodedBody && payload?.parts) {
    const htmlPart = payload.parts.find(
      (part) => part.mimeType === 'text/html' && part.body?.data
    );
    encodedBody = htmlPart?.body?.data || '';
  }

  const decoded = Buffer.from(encodedBody, 'base64').toString('utf-8');

  // ログ確認用（抽出前）
  console.log('📨 メール本文:\n', decoded);

  // 6桁の数字を抽出
  const code = decoded.match(/\d{6}/)?.[0];

  if (!code) throw new Error('認証コード抽出失敗');
  return code;
};