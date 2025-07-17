// /products/featured.ts
import type { D1Database } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
}

export async function getProducts(env: Env) {
  const { results } = await env.DB
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