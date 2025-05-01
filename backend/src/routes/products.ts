import { Hono } from 'hono';

export const d1Route = new Hono<{ Bindings: { DB: D1Database } }>();

d1Route.get("/api/products", async (c) => {
  const { results } = await c.env.DB
    .prepare("SELECT * FROM products WHERE is_own = 1 ORDER BY id DESC LIMIT 100")
    .all();

  return c.json(results);
});