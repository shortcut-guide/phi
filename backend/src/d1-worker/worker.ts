import type { ExecutionContext } from '@cloudflare/workers-types';
import type { D1Database } from '@cloudflare/workers-types';
import { getDriveFile } from "@/b/services/drive";

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
    if (request.method === "POST" && url.pathname === "/products") {
      const body = await request.json() as {
        id: string;
        name: string;
        shop_name: string;
        platform: string;
        base_price: number;
        ec_data: string;
      };
      const { id, name, shop_name, platform, base_price, ec_data } = body;
      await env.PRODUCTS_DB.prepare(
        `INSERT INTO products (id, name, shop_name, platform, base_price, ec_data) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(id, name, shop_name, platform, base_price, ec_data).run();
      return json({ status: "ok" });
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
}