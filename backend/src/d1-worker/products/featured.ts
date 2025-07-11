// /products/featured.ts
import type { D1Database } from '@cloudflare/workers-types';

export async function getProducts(db: D1Database) {
  const { results } = await db
    .prepare(`
      SELECT *
      FROM products
      WHERE is_featured = 1
      ORDER BY updated_at DESC
      LIMIT 10
    `)
    .all();
  return results;
}