// backend/src/config/links.ts
const paypalApi = process.env.PAYPAL_API_URL;
const frontendUrl = process.env.FRONTEND_URL || "";

// localhost判定（http://localhost や http://localhost:3000 も含む）
const isLocalhost =
  /^https?:\/\/localhost(:\d+)?$/i.test(frontendUrl) ||
  frontendUrl.toLowerCase() === "localhost";

// allowedOrigin を条件で切り替え
const allowedOrigin = (!frontendUrl || isLocalhost)
  ? process.env.NEXT_PUBLIC_API_BASE_URL
  : frontendUrl;

export const links = {
  url: {
    paypalCard: "https://www.paypal.com/myaccount/money/cards",
    paypalAddress: "https://www.paypal.com/myaccount/settings/address",
    paypalSuccess: `${allowedOrigin}/paypal/success`,
    paypalCancel: `${allowedOrigin}/paypal/cancel`,
    paypalToken: `${paypalApi}/v1/oauth2/token`,
    paypalOrder: `${paypalApi}/v2/checkout/orders`,
    paypalUserInfo: `${paypalApi}/v1/identity/oauth2/userinfo?schema=paypalv1.1`,
  }
};