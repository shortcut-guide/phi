import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";
import { setCORSHeaders } from "@/b/utils/cors";
import { validateCSRF } from "@/b/utils/csrf";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Adapt VercelRequest to the expected Request type for validateCSRF
  const isValidCSRF = validateCSRF(
    new Request(req.url ?? "", {
      method: req.method,
      headers: req.headers as any,
      body: JSON.stringify(req.body),
    })
  );
  if (!isValidCSRF) {
    return setCORSHeaders(new Response("Invalid CSRF Token", { status: 403 }));
  }

  const { orderID } = req.body;
  if (!orderID) {
    return setCORSHeaders(new Response(JSON.stringify({ error: "Missing orderID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }));
  }

  const auth = await getAccessToken();

  const capture = await fetch(
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
    }
  );
  const json = await capture.json();
  return setCORSHeaders(new Response(JSON.stringify({ status: json.status }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  }));
}

async function getAccessToken() {
  const auth = Buffer.from("CLIENT_ID:SECRET").toString("base64");
  const res = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
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