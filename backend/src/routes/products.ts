import { Hono, Context } from 'hono';
import { GetFilteredProducts } from "@/b/controllers/productController";

export function productRoutes() {
  const app = new Hono();

  app.get('/', async (c: Context) => {
    console.log("[productRoutes] GET /api/products invoked, path =", c.req.path);
    const resp = await GetFilteredProducts(c);
    const data = (await resp.json()) as any;
    return c.json(data, 200);
  });

  return app;
}
