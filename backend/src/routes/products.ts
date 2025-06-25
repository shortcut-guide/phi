import { Hono } from 'hono';
import type { Context } from 'hono';
import { GetProducts } from '@/b/api/products';

export const productRoutes = new Hono();

productRoutes.get('/', async (c: Context) => {
  console.log("[productRoutes] GET /api/products invoked, path =", c.req.path);
  // コントローラを呼び出し
  const resp = await GetProducts(c);
  // JSON をパース
  const data = (await resp.json()) as any;
  // Hono の c.json で返却
  return c.json(data, 200);
});