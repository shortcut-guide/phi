import fetch from "node-fetch";
import { links } from "@/b/config/links";

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;

function getCurrencyFraction(currency: string): number {
  const map: Record<string, number> = { JPY: 0, USD: 2, EUR: 2, GBP: 2, CNY: 2, AUD: 2, CAD: 2 };
  return map[(currency || "").toUpperCase()] ?? 2;
}

function toCurrencyString(n: number, currency: string): string {
  const frac = getCurrencyFraction(currency);
  const factor = Math.pow(10, frac);
  return (Math.round(n * factor) / factor).toFixed(frac);
}

function normalizeItems(rawItems: any[]) {
  const items = (rawItems || []).map((it) => {
    const name = String(it?.name ?? it?.product?.name ?? it?.title ?? "Item");
    const qtyNum = Number(it?.quantity ?? it?.count ?? 1);
    const quantity = String(Number.isFinite(qtyNum) && qtyNum > 0 ? Math.floor(qtyNum) : 1);

    console.log(it);

    const currency_code = String(
      it?.unit_amount?.currency_code || it?.currency_code || "JPY"
    ).toUpperCase();

    const unitValRaw = it?.unit_amount?.value ?? it?.price ?? it?.amount ?? it?.value ?? 0;
    const unitNumber = Number(unitValRaw);
    const unit_amount_value = Number.isFinite(unitNumber) ? unitNumber : 0;

    return {
      name,
      unit_amount: {
        currency_code,
        value: toCurrencyString(unit_amount_value, currency_code),
      },
      quantity,
    };
  });
  return items;
}

function pickSingleCurrencyOrError(items: any[]) {
  const set = new Set(
    items.map((i) => (i?.unit_amount?.currency_code || "JPY").toUpperCase())
  );
  if (set.size === 0) return "JPY";
  if (set.size > 1) return null;
  return Array.from(set)[0] as string;
}

async function getAccessToken(): Promise<string> {
  if (!CLIENT_ID || !CLIENT_SECRET) throw new Error("Missing PayPal credentials");

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${links.url.paypalToken}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal token error: ${res.status} ${text}`);
  }
  const json = await res.json();
  return json.access_token;
}

export async function createOrder(req: any, res: any) {
  try {
    const rawItems = Array.isArray(req.body?.items) ? req.body.items : [];
    if (!rawItems.length) return res.status(400).json({ error: "No items provided" });

    const items = normalizeItems(rawItems);
    const currency_code = pickSingleCurrencyOrError(items);
    if (!currency_code) return res.status(400).json({ error: "Mixed currencies are not supported in a single order." });

    const itemTotal = items.reduce((sum, it) => {
      const val = Number(it.unit_amount.value);
      const qty = Number(it.quantity);
      const v = (Number.isFinite(val) ? val : 0) * (Number.isFinite(qty) ? qty : 0);
      return sum + v;
    }, 0);

    const token = await getAccessToken();

    const body = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: req.body?.reference_id || "CART-ORDER",
          description: req.body?.description || "Cart items",
          amount: {
            currency_code,
            value: toCurrencyString(itemTotal, currency_code),
            breakdown: {
              item_total: { currency_code, value: toCurrencyString(itemTotal, currency_code) },
            },
          },
          items,
        },
      ],
      application_context: {
        brand_name: req.body?.brand_name || "Phi EC",
        locale: req.body?.locale || "ja-JP",
        shipping_preference: req.body?.shipping_preference || "NO_SHIPPING",
        user_action: "PAY_NOW",
        return_url: links.url.paypalSuccess,
        cancel_url: links.url.paypalCancel,
      },
    };

    const response = await fetch(`${links.url.paypalOrder}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: "There was an error creating the order", detail: String(err?.message || err) });
  }
}

export async function captureOrder(req: any, res: any) {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ error: "orderId is required" });
    
    const token = await getAccessToken();
    const response = await fetch(`${links.url.paypalOrder}/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: "The payment was unsuccessful", detail: String(err?.message || err) });
  }
}