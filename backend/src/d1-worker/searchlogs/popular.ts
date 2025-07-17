// backend/src/d1-worker/search/popular.ts
import type { D1Database } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
  POPULAR_KV: KVNamespace;
}

export async function getPopularSearches(env: Env): Promise<string[]> {
  const { results } = await env.DB
    .prepare(`
        SELECT keyword
        FROM search_log
        WHERE keyword IS NOT NULL AND keyword != ''
        ORDER BY count DESC
        LIMIT 20
    `).all();

  return result.results.map((row: any) => row.keyword);
}

export async function saveToKV(env: Env, keywords: string[]): Promise<void> {
  await env.POPULAR_KV.put('popularSearch.json', JSON.stringify(keywords));
}
