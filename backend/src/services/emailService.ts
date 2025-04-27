import nodemailer from 'nodemailer';
import { REQUEST_RESET_URL } from '../config/baseConfig.ts';

export const sendResetEmail = async (toEmail: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: 'パスワード再設定リンク',
    html: `<p>以下のリンクからパスワードを再設定してください。</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};