import { setCORSHeaders } from "@/b/utils/cors";
import { validateCSRF } from "@/b/utils/csrf";
import { getFilteredProducts } from "@/b/models/ProductModel";
import { parse } from "json5";

import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";
import { PAYPAL_API_BASE, PAYPAL_CLIENT_ID, PAYPAL_SECRET } from "@/b/config/env";

async function getProductPrice(productId: string): Promise<{ price: number; currency: string }> {
  const productsResult = await getFilteredProducts({ limit: 100 });
  const products = Array.isArray(productsResult) ? productsResult : [];
  const product = products.find((p) => p.id === productId);

  if (!product) {
    throw new Error("Invalid product or not own product");
  }

  const ecData = typeof product.ec_data === "string"
    ? JSON.parse(product.ec_data)
    : product.ec_data;

  if (!ecData.payment_methods?.includes("paypal")) {
    throw new Error("PayPal is not available for this product");
  }

  return { price: product.base_price / 100, currency: ecData.currency || "USD" };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Convert VercelRequest to Fetch API Request for CSRF validation
  const url = `https://${req.headers.host}${req.url}`;
  const fetchRequest = new Request(url, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body: typeof req.body === "string" ? req.body : JSON.stringify(req.body),
  });

  if (!validateCSRF(fetchRequest)) {
    return setCORSHeaders(new Response("Invalid CSRF Token", { status: 403 }));
  }
  const { productId } = req.body;
  if (!productId) {
    return setCORSHeaders(
      new Response(JSON.stringify({ error: "Missing productId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    );
  }

  let priceInfo;
  try {
    priceInfo = await getProductPrice(productId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return setCORSHeaders(
      new Response(JSON.stringify({ error: message }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    );
  }

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
            currency_code: priceInfo.currency,
            value: priceInfo.price.toFixed(2),
          },
        },
      ],
    }),
  });

  const json = await order.json();
  return setCORSHeaders(
    new Response(JSON.stringify({ orderID: json.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  );
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