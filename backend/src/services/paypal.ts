/**
 * PayPalの認可コードをアクセストークンに交換する
 */

export const exchangeCodeForToken = async (code: string) => {
  const credentials = btoa(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`);

  const res = await fetch(`${process.env.PAYPAL_TOKEN_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
    }),
  });

  if (!res.ok) throw new Error("Failed to exchange authorization code for token");

  return res.json();
};

/**
 * アクセストークンを使ってPayPalユーザー情報を取得する
 */
export const getPaypalUserInfo = async (accessToken: string) => {
  const res = await fetch(`${process.env.PAYPAL_USERINFO_URL}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error("Failed to get PayPal user info");

  return res.json();
};