// /products/latest-sold.ts
import type { D1Database } from '@cloudflare/workers-types';

export async function getProducts(db: D1Database) {
  const { results } = await db
    .prepare(`
      SELECT p.*, COUNT(o.id) AS recent_sales
      FROM products p
      LEFT JOIN orders o
        ON o.product_id = p.id
        AND o.created_at >= DATE('now', '-7 day')
      GROUP BY p.id
      ORDER BY recent_sales DESC
      LIMIT 10
    `)
    .all();
  return results;
}