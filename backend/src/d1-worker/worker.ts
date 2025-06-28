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
    if (request.method === "GET" && url.pathname === "/api/products") {
      const { results } = await env.PRODUCTS_DB.prepare(
        "SELECT * FROM products"
      ).all();
      return json(results);
    }
    if (request.method === "POST" && url.pathname === "/api/products") {
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
        `INSERT INTO products (id, name, shop_name, platform, base_price, ec_data, account_id) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(id, name, shop_name, platform, base_price, ec_data, account_id).run();
      return json({ status: "ok" });
    }
    // ...（PUT/DELETEも同様にaccount_idで制限）

    // --- UserProfile API ---
    if (request.method === "GET" && url.pathname.startsWith("/api/profile/")) {
      const user_id = url.pathname.split("/").pop();
      const { results } = await env.PROFILE_DB.prepare(
        `SELECT * FROM user_profiles WHERE user_id = ? AND account_id = ?`
      ).bind(user_id, account_id).all();
      return json(results);
    }
    if (request.method === "PUT" && url.pathname === "/api/profile") {
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
    if (request.method === "POST" && url.pathname === "/api/searchlogs") {
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
    if (request.method === "GET" && url.pathname === "/api/searchlogs/popular") {
      const { results } = await env.SEARCHLOGS_DB.prepare(
        `SELECT keyword, COUNT(*) as count
         FROM search_logs WHERE account_id = ?
         GROUP BY keyword
         ORDER BY count DESC LIMIT 10`
      ).bind(account_id).all();
      return json(results);
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
}