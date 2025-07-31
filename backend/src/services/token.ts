export async function getAccessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64");
  const res = await fetch(`${process.env.PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to get access token: ${res.status} ${text}`);
  }

  // 型定義
  type PayPalTokenResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    [key: string]: unknown;
  };

  const json = (await res.json()) as PayPalTokenResponse;

  if (!json.access_token) {
    throw new Error("No access_token in PayPal response");
  }

  return json.access_token;
}