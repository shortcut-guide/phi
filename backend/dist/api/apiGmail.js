import { google } from 'googleapis';
// 認証クライアントの作成
const createAuthClient = () => {
    return new google.auth.GoogleAuth({
        credentials: {
            client_id: process.env.GMAIL_CLIENT_ID,
            client_secret: process.env.GMAIL_CLIENT_SECRET,
            refresh_token: process.env.GMAIL_REFRESH_TOKEN,
        },
        scopes: [process.env.GMAIL_SCOPE || 'https://www.googleapis.com/auth/gmail.readonly'],
    });
};
// メッセージID取得ロジック
const getLatestMessageId = async (gmail) => {
    const res = await gmail.users.messages.list({
        userId: 'me',
        q: 'from:no-reply@thebase.in subject:確認コード', // BASEの実際の送信者名に調整
        maxResults: 1,
    });
    const messageId = res.data.messages?.[0]?.id;
    if (!messageId) {
        throw new Error('確認コードメールが見つかりません');
    }
    return messageId;
};
// 認証コード抽出ロジック
const extractVerificationCode = (rawData) => {
    const decodedData = Buffer.from(rawData, 'base64').toString();
    const code = decodedData.match(/\d{6}/)?.[0]; // 6桁コード抽出
    if (!code) {
        throw new Error('認証コード抽出失敗');
    }
    return code;
};
export const getVerificationCode = async () => {
    const auth = createAuthClient();
    const gmail = google.gmail({ version: 'v1', auth });
    const messageId = await getLatestMessageId(gmail);
    const msg = await gmail.users.messages.get({ userId: 'me', id: messageId });
    const rawData = msg.data.payload?.body?.data || '';
    return extractVerificationCode(rawData);
};
