import { setCORSHeaders } from "@/b/utils/cors";
import { validateCSRF } from "@/b/utils/csrf";
import fetch from "node-fetch";
import { PAYPAL_API_BASE, PAYPAL_CLIENT_ID, PAYPAL_SECRET } from "@/b/config/env";
// 仮の価格取得関数（DBなどから取得する想定）
async function getProductPrice(productId) {
    const dummyDB = {
        "product-001": { price: 25.0, currency: "USD" },
        "product-002": { price: 40.0, currency: "USD" },
    };
    return dummyDB[productId];
}
export default async function handler(req, res) {
    if (!validateCSRF(req)) {
        return setCORSHeaders(new Response("Invalid CSRF Token", { status: 403 }));
    }
    const { productId } = req.body;
    if (!productId) {
        return setCORSHeaders(new Response(JSON.stringify({ error: "Missing productId" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        }));
    }
    const { price, currency } = await getProductPrice(productId);
    const auth = await getAccessToken();
    const order = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${auth}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: currency,
                        value: price.toFixed(2),
                    },
                },
            ],
        }),
    });
    const json = await order.json();
    return setCORSHeaders(new Response(JSON.stringify({ orderID: json.id }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    }));
}
async function getAccessToken() {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
    const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
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
