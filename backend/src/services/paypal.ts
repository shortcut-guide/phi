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
      grant_type: "client_credentials",
      code,
    }),
  });
  const json = await res.json();
  return json;
};

/**
 * アクセストークンを使ってPayPalユーザー情報を取得する
 */
export const getPaypalUserInfo = async (accessToken: string) => {
  const url = process.env.PAYPAL_USERINFO_URL!;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("PayPal token error:", text);
    throw new Error("Failed to exchange authorization code for token: " + text);
  }

  return res.json();
};