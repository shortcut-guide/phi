import crypto from 'crypto';
import { messages } from '../config/messageConfig';
import { FRONTEND_URL } from '../config/baseConfig.ts';
import { sendResetEmail } from '../services/emailService';
import { db } from '../config/database';

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: messages.ErrorMail3 }); // / メールアドレスは必須です
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1時間有効

  try {
    await db.prepare(`
      INSERT INTO password_resets (email, token, expires_at)
      VALUES (?, ?, ?)
    `).bind(email, token, expires.toISOString()).run();

    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
    await sendResetEmail(email, resetLink);

    return res.status(200).json({ message: messages.passwordReset1 }); // / リセットリンクを送信しました
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: messages.ErrorPasswordReset1 }); // / リセット処理中にエラーが発生しました
  }
};