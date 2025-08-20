import type { ExecutionContext } from '@cloudflare/workers-types';
import type { D1Database } from '@cloudflare/workers-types';
import { getDriveFile } from "@/b/services/drive";
import { createAffiliateTables } from "@/b/d1-worker/affiliate/create_tables";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // --- JWT認証（必須） ---
    const auth = request.headers.get("Authorization");
    let account_id: string | undefined;
    if (auth && auth.startsWith("Bearer ")) {
      const token = auth.substring(7);
      try {
        const jwt = parseJwt(token);
        account_id = jwt.sub; // 本番は署名検証必須
      } catch (e) {
        return json({ error: "Invalid token" }, 401);
      }
    } else {
      return json({ error: "Unauthorized" }, 401);
    }

    // --- Products API ---
    if (request.method === "GET" && url.pathname === "/products") {
      const { results } = await env.PRODUCTS_DB.prepare(
        "SELECT * FROM products"
      ).all();
      return json(results);
    }

    // --- Search API ---
    // GET /search?query=foo
    if (request.method === "GET" && url.pathname === "/search") {
      const q = (url.searchParams.get("query") || "").trim();
      const qLower = q.toLowerCase();
      if (!qLower) return json({ results: [], suggestions: [] });

      // helper to safe parse ec_data
      const safeParse = (v: any) => {
        if (!v) return v;
        try {
          return typeof v === 'string' ? JSON.parse(v) : v;
        } catch (e) {
          return v;
        }
      };

      // try FTS5-based search first for speed; if fails, fallback to LIKE
      try {
        // build FTS query (prefix search)
        const tokens = qLower.split(/\s+/).filter(Boolean).map(t => `${t}*`).join(' ');
        const { results } = await env.PRODUCTS_DB.prepare(
          `SELECT p.id, p.name, p.platform, p.price, p.currency, p.country, p.ec_data, p.created_at, p.updated_at
           FROM products_fts fts JOIN products p ON fts.rowid = p.rowid
           WHERE products_fts MATCH ?
           ORDER BY p.updated_at DESC
           LIMIT 100`
        ).bind(tokens).all();

        const products = results.map((r: any) => ({
          ...r,
          ec_data: safeParse(r.ec_data)
        }));

        // suggestions: collect ec_data.search_terms and name tokens that include query
        const suggestionsSet = new Set<string>();
        for (const row of products) {
          try {
            const ec = row.ec_data;
            if (ec && Array.isArray(ec.search_terms)) {
              for (const s of ec.search_terms) {
                if (typeof s === 'string' && s.toLowerCase().includes(qLower)) suggestionsSet.add(s);
              }
            }
            if (row.name && typeof row.name === 'string') {
              row.name.split(/[\s、。,\-\/&_]+/).forEach((tok: string) => {
                if (tok && tok.toLowerCase().includes(qLower)) suggestionsSet.add(tok);
              });
            }
          } catch (e) {}
        }

        const suggestions = Array.from(suggestionsSet).slice(0, 20);
        return json({ results: products, suggestions });
      } catch (e) {
        // fallback to LIKE search
        const like = `%${qLower}%`;
        const { results } = await env.PRODUCTS_DB.prepare(
          `SELECT id, name, platform, price, currency, country, ec_data, created_at, updated_at
           FROM products
           WHERE lower(name) LIKE ? OR lower(ec_data) LIKE ? OR id = ?
           ORDER BY updated_at DESC
           LIMIT 100`
        ).bind(like, like, q).all();

        const products = results.map((r: any) => ({
          ...r,
          ec_data: safeParse(r.ec_data)
        }));

        const suggestionsSet = new Set<string>();
        for (const row of products) {
          try {
            const ec = row.ec_data;
            if (ec && Array.isArray(ec.search_terms)) {
              for (const s of ec.search_terms) {
                if (typeof s === 'string' && s.toLowerCase().includes(qLower)) suggestionsSet.add(s);
              }
            }
            if (row.name && typeof row.name === 'string') {
              row.name.split(/[\s、。,\-\/&_]+/).forEach((tok: string) => {
                if (tok && tok.toLowerCase().includes(qLower)) suggestionsSet.add(tok);
              });
            }
          } catch (e) {}
        }
        const suggestions = Array.from(suggestionsSet).slice(0, 20);
        return json({ results: products, suggestions });
      }
    }

    // --- UserProfile API ---
    if (request.method === "GET" && url.pathname.startsWith("/profile/")) {
      const user_id = url.pathname.split("/").pop();
      const { results } = await env.PROFILE_DB.prepare(
        `SELECT * FROM user_profiles WHERE user_id = ? AND account_id = ?`
      ).bind(user_id, account_id).all();
      return json(results);
    }
    
    if (request.method === "PUT" && url.pathname === "/profile") {
      const { user_id, nickname, bio, avatar_url } = await request.json() as {
        user_id: string;
        nickname: string;
        bio: string;
        avatar_url: string;
      };
      await env.PROFILE_DB.prepare(
        `INSERT INTO user_profiles (user_id, nickname, bio, avatar_url, account_id)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(user_id) DO UPDATE SET
            nickname = excluded.nickname,
            bio = excluded.bio,
            avatar_url = excluded.avatar_url,
            updated_at = CURRENT_TIMESTAMP`
      ).bind(user_id, nickname, bio, avatar_url, account_id).run();
      return json({ status: "ok" });
    }

    // --- SearchLog API ---
    if (request.method === "POST" && url.pathname === "/searchlogs") {
      const { keyword, user_id } = await request.json() as {
        keyword: string;
        user_id: string;
      };
      const id = crypto.randomUUID();
      await env.SEARCHLOGS_DB.prepare(
        `INSERT INTO search_logs (id, keyword, user_id, account_id)
          VALUES (?, ?, ?, ?)`
      ).bind(id, keyword, user_id, account_id).run();
      return json({ status: "ok" });
    }
    if (request.method === "GET" && url.pathname === "/searchlogs/popular") {
      const { results } = await env.SEARCHLOGS_DB.prepare(
        `SELECT keyword, COUNT(*) as count
         FROM search_logs
         GROUP BY keyword
         ORDER BY count DESC LIMIT 10`
      ).all();
      return json(results);
    }
    if (request.method === "GET" && url.pathname === "/searchlogs") {
      const { results } = await env.SEARCHLOGS_DB.prepare(
        `SELECT id, keyword, user_id, clicked_product_id, created_at
         FROM search_logs
         WHERE account_id = ?
         ORDER BY created_at DESC
         LIMIT 100`
      ).bind(account_id).all();
      return json(results);
    }

    // --- Drive API ---
    if (request.method === "GET" && url.pathname === "/drive/") {
      const fileId = url.searchParams.get("id");
      if (!fileId) return json({ error: "Missing file id" }, 400);
      try {
        const buffer = await getDriveFile(fileId, env.DRIVE_KV);
        return new Response(buffer, {
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `attachment; filename=\"${fileId}\"`,
          },
        });
      } catch (e) {
        return json({ error: "Failed to fetch from Drive" }, 500);
      }
    }

    // --- Affiliate D1 初期化（管理用エンドポイント、保護推奨） ---
    if ((request.method === "POST" || request.method === "PUT") && url.pathname === "/affiliate/init") {
      if (!env.AFFILIATE_DB) return json({ error: "AFFILIATE_DB binding not configured" }, 500);
      try {
        await createAffiliateTables(env.AFFILIATE_DB);
        return json({ status: "ok" });
      } catch (e) {
        return json({ error: String(e) }, 500);
      }
    }

    // --- Affiliate クリック保存エンドポイント ---
    if (request.method === "POST" && url.pathname === "/affiliate/click") {
      if (!env.AFFILIATE_DB) return json({ error: "AFFILIATE_DB binding not configured" }, 500);
      try {
        const body = await request.json() as any;
        const id = body.id || crypto.randomUUID();
        const user_id = body.user_id || null;
        const asin = body.asin || null;
        const shop = body.shop || null;
        const tracking_id = body.tracking_id || null;
        const target_url = body.target_url || null;
        const referer = body.referer || null;
        const ip = body.ip || null;
        const user_agent = body.user_agent || null;
        const meta = body.meta ? JSON.stringify(body.meta) : null;

        await env.AFFILIATE_DB.prepare(
          `INSERT INTO affiliate_clicks (id, user_id, asin, shop, tracking_id, target_url, referer, ip, user_agent, meta)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(id, user_id, asin, shop, tracking_id, target_url, referer, ip, user_agent, meta).run();

        return json({ status: "ok", id });
      } catch (e) {
        return json({ error: String(e) }, 500);
      }
    }

    if (request.method === "GET" && url.pathname === "/affiliate/health") {
      return json({ ok: !!env.AFFILIATE_DB });
    }

    return new Response("Not found", { status: 404 });
  }
};

// --- JWTデコード（本番はverify必須） ---
function parseJwt(token: string): any {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
}

// --- JSONレスポンス ---
function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// --- D1バインディング型 ---
interface Env {
  PRODUCTS_DB: D1Database;
  PROFILE_DB: D1Database;
  SEARCHLOGS_DB: D1Database;
  DRIVE_KV: KVNamespace;
  AFFILIATE_DB?: D1Database; // optional binding for affiliate tracking
}