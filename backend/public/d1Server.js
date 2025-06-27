// src/d1Server.ts
import { Hono as Hono3 } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

// src/routes/token.ts
import { Hono } from "hono";

// src/services/token.ts
var getToken = async (db) => {
  return await db.prepare("SELECT * FROM oauth_tokens ORDER BY id DESC LIMIT 1").first();
};
var saveToken = async (db, token) => {
  await db.prepare(`INSERT INTO oauth_tokens (access_token, refresh_token, expires_at) VALUES (?, ?, ?)`).bind(token.access_token, token.refresh_token, token.expires_at).run();
};
var updateToken = async (db, token) => {
  await db.prepare(
    `UPDATE oauth_tokens SET access_token = ?, refresh_token = ?, expires_at = ? WHERE id = (SELECT id FROM oauth_tokens ORDER BY id DESC LIMIT 1)`
  ).bind(token.access_token, token.refresh_token, token.expires_at).run();
};
var deleteToken = async (db) => {
  await db.prepare(`DELETE FROM oauth_tokens`).run();
};

// src/routes/token.ts
var tokenRoutes = new Hono();
tokenRoutes.get("/api/token", async (c) => {
  try {
    const token = await getToken(c.env.DB);
    if (!token || !token.token) {
      return c.json({ error: "\u30C8\u30FC\u30AF\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002" }, 400);
    }
    return c.json(token);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "\u30C8\u30FC\u30AF\u30F3\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002" }, 500);
  }
});
tokenRoutes.post("/api/token", async (c) => {
  try {
    const body = await c.req.json();
    if (!body || !body.token) {
      return c.json({ error: "\u30C8\u30FC\u30AF\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002" }, 400);
    }
    await saveToken(c.env.DB, body);
    return c.json({ status: "saved" });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "\u30C8\u30FC\u30AF\u30F3\u306E\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002" }, 500);
  }
});
tokenRoutes.put("/api/token", async (c) => {
  try {
    const body = await c.req.json();
    if (!body || !body.token) {
      return c.json({ error: "\u30C8\u30FC\u30AF\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002" }, 400);
    }
    await updateToken(c.env.DB, body);
    return c.json({ status: "updated" });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "\u30C8\u30FC\u30AF\u30F3\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002" }, 500);
  }
});
tokenRoutes.delete("/api/token", async (c) => {
  try {
    const body = await c.req.json();
    if (!body || !body.token) {
      return c.json({ error: "\u30C8\u30FC\u30AF\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002" }, 400);
    }
    await deleteToken(c.env.DB);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "\u30C8\u30FC\u30AF\u30F3\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002" }, 500);
  }
});

// src/routes/products.ts
import { Hono as Hono2 } from "hono";

// src/config/consoleMessage.ts
var cMessages = {
  1: "Unknown error",
  2: "Upload or DB error",
  3: "Invalid product data",
  4: "Internal server error",
  5: "Imgur upload failed"
};

// src/config/messageConfig.ts
var messages = {
  passwordReset1: "\u30EA\u30BB\u30C3\u30C8\u30EA\u30F3\u30AF\u3092\u9001\u4FE1\u3057\u307E\u3057\u305F",
  passwordReset2: "\u30EA\u30BB\u30C3\u30C8\u30EA\u30F3\u30AF\u306F1\u6642\u9593\u6709\u52B9\u3067\u3059",
  passwordReset3: "\u30EA\u30BB\u30C3\u30C8\u30EA\u30F3\u30AF\u306F\u7121\u52B9\u3067\u3059",
  ErrorMail1: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093",
  ErrorMail2: "\u30E1\u30FC\u30EB\u9001\u4FE1\u4E2D\u306B\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F",
  ErrorMail3: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306F\u5FC5\u9808\u3067\u3059",
  ErrorPasswordReset1: "\u30EA\u30BB\u30C3\u30C8\u51E6\u7406\u4E2D\u306B\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F",
  utilsD1: {
    ja: {
      ErrorSITE_DB: "D1 \u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u304C\u30D0\u30A4\u30F3\u30C9\u3055\u308C\u3066\u3044\u307E\u305B\u3093 (SITE_DB \u304C\u672A\u5B9A\u7FA9)",
      ErrorSEARCHLOGS_DB: "D1 \u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u304C\u30D0\u30A4\u30F3\u30C9\u3055\u308C\u3066\u3044\u307E\u305B\u3093 (SEARCHLOGS_DB \u304C\u672A\u5B9A\u7FA9)",
      ErrorPROFILE_DB: "D1 \u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u304C\u30D0\u30A4\u30F3\u30C9\u3055\u308C\u3066\u3044\u307E\u305B\u3093 (PROFILE_DB \u304C\u672A\u5B9A\u7FA9)",
      ErrorPRODUCTS_DB: "D1 \u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u304C\u30D0\u30A4\u30F3\u30C9\u3055\u308C\u3066\u3044\u307E\u305B\u3093 (PRODUCTS_DB \u304C\u672A\u5B9A\u7FA9)"
    },
    en: {
      ErrorSITE_DB: "D1 client is not bound (SITE_DB is undefined)",
      ErrorSEARCHLOGS_DB: "D1 client is not bound (SEARCHLOGS_DB is undefined)",
      ErrorPROFILE_DB: "D1 client is not bound (PROFILE_DB is undefined)",
      ErrorPRODUCTS_DB: "D1 client is not bound (PRODUCTS_DB is undefined)"
    }
  },
  searchClient: {
    ja: {
      ErrorSearch: "\u5546\u54C1\u691C\u7D22\u306B\u5931\u6557\u3057\u307E\u3057\u305F",
      ErrorSuggest: "\u30B5\u30B8\u30A7\u30B9\u30C8\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F"
    },
    en: {
      ErrorSearch: "Failed to search products",
      ErrorSuggest: "Failed to fetch suggestions"
    }
  },
  api: {
    sites: {
      fetchError: {
        ja: "\u30C7\u30FC\u30BF\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002"
      },
      validateTitleUrl: {
        ja: "title \u3068 url \u306F\u5FC5\u9808\u3067\u3059\u3002"
      },
      insertError: {
        ja: "\u30C7\u30FC\u30BF\u306E\u8FFD\u52A0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002"
      },
      notFound: {
        ja: "\u30B5\u30A4\u30C8\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002"
      },
      updateError: {
        ja: "\u30C7\u30FC\u30BF\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002"
      },
      noUpdateData: {
        ja: "\u66F4\u65B0\u3059\u308B\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002"
      },
      updateSuccess: {
        ja: "\u66F4\u65B0\u6210\u529F"
      },
      deleteError: {
        ja: "\u30C7\u30FC\u30BF\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002"
      },
      deleteNotFound: {
        ja: "\u524A\u9664\u3059\u308B\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002"
      },
      deleteSuccessPrefix: {
        ja: "\u524A\u9664\u6210\u529F: "
      }
    }
  }
};

// src/utils/lang.ts
function getLang() {
  const urlLang = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("lang") : null;
  if (urlLang === "ja" || urlLang === "en")
    return urlLang;
  if (typeof localStorage !== "undefined") {
    const storedLang = localStorage.getItem("lang");
    if (storedLang === "ja" || storedLang === "en")
      return storedLang;
  }
  if (typeof navigator !== "undefined") {
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang === "ja" || browserLang === "en")
      return browserLang;
  }
  return "ja";
}

// src/utils/contextHolder.ts
var currentContext = null;
var getContext = () => {
  if (!currentContext)
    throw new Error("Context not set");
  return currentContext;
};
var getD1Client = (key) => {
  const ctx = getContext();
  const db = ctx.env?.[key];
  if (!db)
    throw new Error(`D1Database "${key}" is not bound.`);
  return db;
};

// src/utils/d1.ts
var lang = getLang();
var t = messages.utilsD1?.[lang];
var getD1Product = () => {
  try {
    return getD1Client("PRODUCTS_DB");
  } catch {
    throw new Error(t.ErrorPRODUCTS_DB);
  }
};

// src/utils/executeQuery.ts
async function selectQuery(db, query, bindings = []) {
  const stmt = db.prepare(query).bind(...bindings);
  const result = await stmt.all();
  return [...result.results];
}

// src/models/ProductModel.ts
async function getFilteredProducts({
  id,
  name,
  shop_name,
  platform,
  base_price,
  ec_data,
  limit
}) {
  const db = getD1Product();
  let query = "SELECT * FROM products";
  const conditions = [];
  const bindings = [];
  if (id) {
    conditions.push("id = ?");
    bindings.push(id);
  }
  if (name) {
    conditions.push("name = ?");
    bindings.push(name);
  }
  if (shop_name) {
    conditions.push("shop_name = ?");
    bindings.push(shop_name);
  }
  if (platform) {
    conditions.push("platform = ?");
    bindings.push(platform);
  }
  if (base_price) {
    conditions.push("base_price = ?");
    bindings.push(base_price);
  }
  if (ec_data) {
    conditions.push("ec_data = ?");
    bindings.push(ec_data);
  }
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  if (!limit) {
    limit = 10;
  }
  query += " ORDER BY updated_at DESC LIMIT ?";
  bindings.push(limit);
  return await selectQuery(db, query, bindings);
}

// src/services/products.ts
async function handleGetFilteredProducts(id, name, shop_name, platform, base_price, ec_data, limit) {
  return await getFilteredProducts({ id, name, shop_name, platform, base_price, ec_data, limit }) ?? [];
}

// src/controllers/productController.ts
async function GetFilteredProducts(c) {
  try {
    const id = c.req.query("id");
    const name = c.req.query("name");
    const shop_name = c.req.query("shop_name");
    const platform = c.req.query("platform");
    const limit = Number(c.req.query("limit"));
    const results = await handleGetFilteredProducts(id, name, shop_name, platform, limit);
    return c.json(results, 200);
  } catch (error) {
    console.error("[GET /products] Error:", error);
    return c.json({ status: "error", message: cMessages[4] }, 500);
  }
}

// src/api/products.ts
async function GetProducts(c) {
  return await GetFilteredProducts(c);
}

// src/routes/products.ts
var productRoutes = new Hono2();
productRoutes.get("/", async (c) => {
  console.log("[productRoutes] GET /api/products invoked, path =", c.req.path);
  const resp = await GetProducts(c);
  const data = await resp.json();
  return c.json(data, 200);
});

// src/d1Server.ts
var app = new Hono3();
app.use(
  "*",
  cors({
    origin: "*",
    // ✅ すべてのオリジンからのアクセスを許可
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"]
  })
);
app.use("*", async (c, next) => {
  c.header(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';"
  );
  await next();
});
app.route("/api/token", tokenRoutes);
app.route("/api/products", productRoutes);
app.get("/api/token/", (c) => c.redirect("/api/token", 301));
app.get("/api/products/", (c) => c.redirect("/api/products", 301));
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});
var PORT = Number(process.env.PORT) || 3e3;
console.log(`\u{1F680} Server listening on http://localhost:${PORT}`);
serve({ fetch: app.fetch, port: PORT });
//# sourceMappingURL=d1Server.js.map
