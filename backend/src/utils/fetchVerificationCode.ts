import { google } from 'googleapis';

export const fetchVerificationCode = async (): Promise<string> => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_id: process.env.GMAIL_CLIENT_ID,
      client_secret: process.env.GMAIL_CLIENT_SECRET,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    },
    scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
  });

  const gmail = google.gmail({ version: 'v1', auth });

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'from:no-reply@thebase.in subject:認証番号',
    maxResults: 1,
  });

  const messageId = res.data.messages?.[0]?.id;
  if (!messageId) throw new Error('認証メールが見つかりません');

  const msg = await gmail.users.messages.get({ userId: 'me', id: messageId });
  const raw = msg.data.payload?.body?.data;
  const decoded = Buffer.from(raw || '', 'base64').toString();
  const code = decoded.match(/\d{6}/)?.[0];

  if (!code) throw new Error('認証コード抽出失敗');
  return code;
};