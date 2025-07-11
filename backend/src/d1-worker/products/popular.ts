// /products/popular.ts
import type { D1Database } from '@cloudflare/workers-types';


export async function getProducts(db: D1Database) {
  const { results } = await db
    .prepare(`
      SELECT p.*, COUNT(o.id) AS sales_count
      FROM products p
      LEFT JOIN orders o
        ON o.product_id = p.id
      GROUP BY p.id
      ORDER BY sales_count DESC
      LIMIT 10
    `)
    .all();
  return results;
}