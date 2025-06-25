// backend/controllers/productController.ts
import type { Context } from "hono";
import type { APIRoute, APIContext } from "astro";
import type { Product } from "@/b/types/product";

import { cMessages } from "@/b/config/consoleMessage.ts";

import { createProduct, updateProduct, deleteProduct, getFilteredProducts } from "@/b/models/ProductModel";
import { validateProduct } from "@/b/utils/validateProduct";

/**d
 * Parse and validate the request body
 */
async function parseAndValidateRequestBody(request: Request): Promise<Product> {
  const body: any = await request.json();

  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid request body: expected an object");
  }

  const id = crypto.randomUUID();
  const product: Product = {
    id,
    name: body.name ?? "Unknown Product",
    shop_name: body.shop_name ?? "Unknown Shop",
    platform: body.platform ?? "Unknown Platform",
    base_price: body.base_price ?? 0,
    ec_data: typeof body.ec_data === "string" ? body.ec_data : JSON.stringify(body.ec_data ?? {}),
  };

  if (!validateProduct(product)) {
    throw new Error(cMessages[2]); // Invalid product data
  }

  return product;
}

/**
 * Handle POST requests for creating a product
 */
export const POST: APIRoute = async ({ request }: { request: Request }) => {
  try {
    const product = await parseAndValidateRequestBody(request);
    await createProduct(product);

    return new Response(JSON.stringify({ status: "success", message: cMessages[1] }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("[POST /product] Error:", error.message);
      const message = error.message || cMessages[4]; // Internal server error
      return new Response(JSON.stringify({ status: "error", message }), {
        status: error.message === cMessages[2] ? 400 : 500,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      console.error("[POST /product] Error:", error);
      return new Response(JSON.stringify({ status: "error", message: cMessages[4] }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};

/**
 * Handle PUT requests for updating a product
 */
export const PUT: APIRoute = async ({ request, params }: APIContext) => {
  try {
    const body: any = await request.json();

    const id = params.id; // 型を Record<string, string | undefined> に対応
    if (!id) {
      return new Response(JSON.stringify({ status: "error", message: "Product ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (typeof body !== "object" || body === null) {
      return new Response(JSON.stringify({ status: "error", message: "Invalid request body: expected an object" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Construct a complete Product object
    const product: Product = {
      id,
      name: body.name ?? "Unknown Product",
      shop_name: body.shop_name ?? "Unknown Shop",
      platform: body.platform ?? "Unknown Platform",
      base_price: body.base_price ?? 0,
      ec_data: typeof body.ec_data === "string" ? body.ec_data : JSON.stringify(body.ec_data ?? {}),
    };

    if (!validateProduct(product)) {
      return new Response(JSON.stringify({ status: "error", message: cMessages[2] }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await updateProduct(product);

    return new Response(JSON.stringify({ status: "success", message: cMessages[1] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[PUT /product/:id] Error:", error instanceof Error ? error.message : error);
    return new Response(JSON.stringify({ status: "error", message: cMessages[4] }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

/**
 * Handle DELETE requests for deleting a product
 */
export const DELETE: APIRoute = async ({ params }: APIContext) => {
  try {
    const id = params.id; // 型を Record<string, string | undefined> に対応
    if (!id) {
      return new Response(JSON.stringify({ status: "error", message: "Product ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await deleteProduct(id);

    return new Response(JSON.stringify({ status: "success", message: cMessages[1] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[DELETE /product/:id] Error:", error instanceof Error ? error.message : error);
    return new Response(JSON.stringify({ status: "error", message: cMessages[4] }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

/**
 * Handle GET requests for filtered products using Hono
 */
/**
 * Handle GET requests for filtered products using Hono
 */
export async function GetFilteredProducts(c: Context): Promise<Response> {
  try {
    const shop = c.req.query("shop") ?? undefined;
    const limit = Number(c.req.query("limit") ?? 100);

    // モデルからデータを取得。null/undefined なら空配列を返す
    const results = (await getFilteredProducts({ shop, limit })) ?? [];

    return c.json(results, 200);
  } catch (error) {
    console.error("[GET /products] Error:", error instanceof Error ? error.message : error);
    return c.json({ status: "error", message: cMessages[4] }, 500);
  }
}
