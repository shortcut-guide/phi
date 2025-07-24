// backend/controllers/paypalOrderController.ts
import fetch from "node-fetch";

const PAYPAL_API = "https://api-m.paypal.com"; // sandbox: https://api-m.sandbox.paypal.com
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;

// アクセストークン取得
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const json = await res.json();
  return json.access_token;
}

// 注文作成
export async function createOrder(req, res) {
  try {
    const token = await getAccessToken();

    const body = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: "PRODUCT-001",
          description: "猫缶プレミアムセット",
          amount: {
            currency_code: "JPY",
            value: "2980",
            breakdown: {
              item_total: { currency_code: "JPY", value: "2980" }
            }
          },
          items: [
            {
              name: "猫缶A（マグロ）",
              unit_amount: { currency_code: "JPY", value: "1490" },
              quantity: "1"
            },
            {
              name: "猫缶B（サーモン）",
              unit_amount: { currency_code: "JPY", value: "1490" },
              quantity: "1"
            }
          ]
        }
      ],
      application_context: {
        brand_name: "Phis EC",
        locale: "ja-JP",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        return_url: "https://phis.jp/paypal/success",
        cancel_url: "https://phis.jp/paypal/cancel"
      }
    };

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("createOrder error", err);
    res.status(500).json({ error: "注文作成に失敗しました" });
  }
}

// 支払い確定
export async function captureOrder(req, res) {
  try {
    const { orderId } = req.params;
    const token = await getAccessToken();

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("captureOrder error", err);
    res.status(500).json({ error: "支払いに失敗しました" });
  }
}
