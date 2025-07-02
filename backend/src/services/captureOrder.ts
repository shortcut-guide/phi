import type { Request, Response } from "express";
import fetch from "node-fetch";
import { getAccessToken } from "@/b/services/token";
import { setCORSHeaders } from "@/b/utils/cors";
import { validateCSRF } from "@/b/utils/csrf";

export async function getCaptureOrder(req: Request, res: Response) {
  // Adapt VercelRequest to the expected Request type for validateCSRF
  const isValidCSRF = validateCSRF(
    new Request(req.url ?? "", {
      method: req.method,
      headers: req.headers as any,
      body: JSON.stringify(req.body),
    })
  );

  if (!isValidCSRF) return setCORSHeaders(new Response("Invalid CSRF Token", { status: 403 }));

  const { orderID } = req.body;
  if (!orderID) {
    return setCORSHeaders(new Response(JSON.stringify({ error: "Missing orderID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }));
  }

  try{
    const auth = await getAccessToken();
    const capture = await fetch(
      `${process.env.PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth}`,
          "Content-Type": "application/json",
        }
      }
    );
    const json = await capture.json();
    return setCORSHeaders(new Response(JSON.stringify({ status: json.status }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }));
  } catch (err) {
    console.error("Capture error:", err);
    return res.status(500).json({ error: "Failed to capture order" });
  }
}

