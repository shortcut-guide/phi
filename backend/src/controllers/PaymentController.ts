import { Env } from "@/b/types/env";

const PAYPAL_API_BASE = "https://api-m.paypal.com";

async function getAccessTokenFromPayPal(env: Env): Promise<string> {
  const clientId = env.PAYPAL_CLIENT_ID;
  const clientSecret = env.PAYPAL_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  if (!res.ok) {
    throw new Error("Failed to retrieve PayPal access token");
  }

  const data = await res.json() as { access_token: string };
  return data.access_token;
}

export async function handleGetPayment({ env }: { env: Env }) {
  const token = await getAccessTokenFromPayPal(env);

  const res = await fetch(`${PAYPAL_API_BASE}/v2/payments/captures`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function handleSetPayment({ request }: { request: Request }) {
  const body = await request.json();
  // Echo back or perform custom logic if needed
  return new Response(JSON.stringify({ received: body }), {
    headers: { "Content-Type": "application/json" }
  });
}