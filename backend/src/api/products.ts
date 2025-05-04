import { Hono } from 'hono';

const app = new Hono<{ Bindings: { DB: D1Database } }>();

app.get('/api/products', async (c) => {
  const shop = c.req.query('shop');        // ECサイト名フィルタ（例: "楽天")
  const limit = Number(c.req.query('limit') ?? 100); // 最大件数
  const ownOnly = c.req.query('ownOnly') === 'true'; // 自社商品のみ

  let query = 'SELECT * FROM products';
  const conditions: string[] = [];
  const bindings: any[] = [];

  if (ownOnly) {
    conditions.push('shop_name = ?');
    bindings.push('自社');
  }

  if (shop) {
    conditions.push('site_name = ?');
    bindings.push(shop);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY updated_at DESC LIMIT ?';
  bindings.push(limit);

  const { results } = await c.env.DB.prepare(query).bind(...bindings).all();
  return c.json(results);
});

export default app;