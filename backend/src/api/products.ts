import { GetFilteredProducts } from "@/b/controllers/productController";
import type { Context } from "hono";

export async function GetProducts(c: Context): Promise<Response> {
  return await GetFilteredProducts(c);
}