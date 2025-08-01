// /products/featured.ts
import type { D1Database } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
}

export async function getCart(env: Env, userId: string) {
  const { results } = await env.DB
    .prepare(`SELECT * FROM cart WHERE user_id = ? ORDER BY id DESC`)
    .bind(userId)
    .all();
  return results;
}