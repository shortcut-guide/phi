import { getAccessToken } from "@/b/services/token";

export async function getPaymentCapture() {
  const token = await getAccessToken();
  const res = await fetch(`${process.env.PAYPAL_API_BASE}/v2/payments/captures`, {
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