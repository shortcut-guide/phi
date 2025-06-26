// backend/controllers/productController.ts
import type { Context } from "hono";
import type { APIRoute, APIContext } from "astro";

import { cMessages } from "@/b/config/consoleMessage";
import {
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  handleGetFilteredProducts
} from "@/b/services/products";

// POST
export const POST: APIRoute = async ({ request }) => {
  try {
    return await handleCreateProduct(request);
  } catch (error) {
    return errorResponse("[POST /product]", error);
  }
};

// PUT
export const PUT: APIRoute = async ({ request, params }) => {
  try {
    return await handleUpdateProduct(request, params.id);
  } catch (error) {
    return errorResponse("[PUT /product/:id]", error);
  }
};

// DELETE
export const DELETE: APIRoute = async ({ params }) => {
  try {
    return await handleDeleteProduct(params.id);
  } catch (error) {
    return errorResponse("[DELETE /product/:id]", error);
  }
};

// GET
export async function GetFilteredProducts(c: Context): Promise<Response> {
  try {
    const shop = c.req.query("shop");
    const limit = Number(c.req.query("limit") ?? 100);
    const results = await handleGetFilteredProducts(shop, limit);
    return c.json(results, 200);
  } catch (error) {
    console.error("[GET /products] Error:", error);
    return c.json({ status: "error", message: cMessages[4] }, 500);
  }
}

// 共通エラー出力
function errorResponse(prefix: string, error: unknown): Response {
  const message = error instanceof Error ? error.message : cMessages[4];
  console.error(`${prefix} Error:`, message);
  return new Response(JSON.stringify({ status: "error", message }), {
    status: message === cMessages[2] ? 400 : 500,
    headers: { "Content-Type": "application/json" },
  });
}
