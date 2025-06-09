import { handleGetFilteredProducts } from "@/b/controllers/productController";
import type { Context } from "hono";

export async function handleGetProducts(c: Context): Promise<Response> {
  return await handleGetFilteredProducts(c);
}