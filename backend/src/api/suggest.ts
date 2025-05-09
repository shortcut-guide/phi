import { getD1SearchLogs } from '@/b/utils/d1';

export const GET: APIRoute = async ({ request }: { request: Request }) => {
  const prefix = new URL(request.url).searchParams.get("prefix");

  if (!prefix) return new Response("Missing prefix", { status: 400 });

  const db = getD1SearchLogs();
  const stmt = db.prepare(`
    SELECT DISTINCT name FROM products 
    WHERE name LIKE ?
    ORDER BY updated_at DESC
    LIMIT 10;
  `).bind(`${prefix}%`);

  const suggestions = await stmt.all();
  return new Response(JSON.stringify(suggestions), { status: 200 });
};