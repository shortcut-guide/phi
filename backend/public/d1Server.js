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
var d1Route = new Hono();
d1Route.get("/api/token", async (c) => {
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
d1Route.post("/api/token", async (c) => {
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
d1Route.put("/api/token", async (c) => {
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
d1Route.delete("/api/token", async (c) => {
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

// src/config/env.ts
import { config } from "dotenv";
import { resolve } from "path";
var ENV = process.env.NODE_ENV || "develop";
var envFile = resolve(process.cwd(), `.env.${ENV}`);
config({ path: envFile });
var required = (key) => {
  const value = process.env[key];
  if (!value)
    throw new Error(`Missing environment variable: ${key}`);
  return value;
};
var PORT = process.env.PORT || 3e3;
var SEARCHLOGS_DB = required("CLOUDFLARE_D1_DATABASE_SEARCH_LOGS");
var PRODUCTS_DB = required("CLOUDFLARE_D1_DATABASE_PRODUCTS");
var PROFILE_DB = required("CLOUDFLARE_D1_DATABASE_PROFILE");
var PUP_DB = required("CLOUDFLARE_D1_DATABASE_PUP");
var PAYPAL_CLIENT_ID = required("PAYPAL_CLIENT_ID");
var PAYPAL_SECRET = required("PAYPAL_SECRET");
var PAYPAL_API_BASE = required("PAYPAL_API_BASE");
var IMGUR_CLIENT_ID = required("IMGUR_CLIENT_ID");

// src/utils/d1.ts
var DB;
var getD1Product = () => {
  DB = PRODUCTS_DB;
  if (!DB)
    throw new Error("D1 \u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u304C\u30D0\u30A4\u30F3\u30C9\u3055\u308C\u3066\u3044\u307E\u305B\u3093 (PRODUCTS_DB \u304C\u672A\u5B9A\u7FA9)");
  return DB;
};

// src/utils/executeQuery.ts
async function executeQuery(db, query, bindings = [], isSelect = false) {
  const stmt = db.prepare(query).bind(...bindings);
  if (isSelect) {
    const result = await stmt.all();
    return result.results;
  } else {
    return await stmt.run();
  }
}

// src/models/ProductModel.ts
async function getFilteredProducts({
  shop,
  limit,
  ownOnly
}) {
  const db = getD1Product();
  let query = "SELECT * FROM products";
  const conditions = [];
  const bindings = [];
  if (ownOnly) {
    conditions.push("shop_name = ?");
    bindings.push("\u81EA\u793E");
  }
  if (shop) {
    conditions.push("site_name = ?");
    bindings.push(shop);
  }
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  query += " ORDER BY updated_at DESC LIMIT ?";
  bindings.push(limit);
  return await executeQuery(db, query, bindings, true);
}

// src/config/consoleMessage.ts
var cMessages = {
  1: "Unknown error",
  2: "Upload or DB error",
  3: "Invalid product data",
  4: "Internal server error",
  5: "Imgur upload failed"
};

// src/controllers/productController.ts
async function handleGetFilteredProducts(c) {
  try {
    const shop = c.req.query("shop") ?? void 0;
    const limit = Number(c.req.query("limit") ?? 100);
    const ownOnly = c.req.query("ownOnly") === "true";
    const results = await getFilteredProducts({ shop, limit, ownOnly });
    return c.json(results, 200);
  } catch (error) {
    console.error("[GET /products] Error:", error instanceof Error ? error.message : error);
    return c.json({ status: "error", message: cMessages[4] }, 500);
  }
}

// src/api/products.ts
async function handleGetProducts(c) {
  return await handleGetFilteredProducts(c);
}

// src/routes/products.ts
var productRoutes = new Hono2();
productRoutes.get("/products", handleGetProducts);
var products_default = productRoutes;

// src/views/index.ts
function renderIndex() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Hono API</title>
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'self'; font-src 'self' data:; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';">
  <style>
    body { font-family: sans-serif; margin: 2rem; }
  </style>
</head>
<body>
  <h1>\u2705 Hono API is running</h1>
  <p>You can now access your API endpoints.</p>
</body>
</html>`;
}

// src/config/messageConfig.ts
var messages = {
  passwordReset1: "\u30EA\u30BB\u30C3\u30C8\u30EA\u30F3\u30AF\u3092\u9001\u4FE1\u3057\u307E\u3057\u305F",
  passwordReset2: "\u30EA\u30BB\u30C3\u30C8\u30EA\u30F3\u30AF\u306F1\u6642\u9593\u6709\u52B9\u3067\u3059",
  passwordReset3: "\u30EA\u30BB\u30C3\u30C8\u30EA\u30F3\u30AF\u306F\u7121\u52B9\u3067\u3059",
  ErrorMail1: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093",
  ErrorMail2: "\u30E1\u30FC\u30EB\u9001\u4FE1\u4E2D\u306B\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F",
  ErrorMail3: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306F\u5FC5\u9808\u3067\u3059",
  ErrorPasswordReset1: "\u30EA\u30BB\u30C3\u30C8\u51E6\u7406\u4E2D\u306B\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F",
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

// src/d1Server.ts
var publicApp = new Hono3();
publicApp.route("/api", products_default);
var app = new Hono3().basePath("/admin");
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
app.get("/", async (c) => {
  const html = renderIndex();
  return c.html(html);
});
app.get("/api/sites", async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM sites ORDER BY createdAt DESC").all();
    return c.json(results);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : messages.api.sites.fetchError.ja }, 500);
  }
});
app.post("/api/sites", async (c) => {
  try {
    const body = await c.req.json();
    const { title, url, element } = body;
    if (!title || !url) {
      return c.json({ error: messages.api.sites.validateTitleUrl.ja }, 400);
    }
    const jsonElement = element ? JSON.stringify(element) : "{}";
    const { meta } = await c.env.DB.prepare(
      "INSERT INTO sites (title, url, element, createdAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP) RETURNING id"
    ).bind(title, url, jsonElement).run();
    return c.json({ id: meta.last_row_id });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : messages.api.sites.insertError.ja }, 500);
  }
});
app.get("/api/sites/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { results } = await c.env.DB.prepare("SELECT * FROM sites WHERE id = ?").bind(id).all();
    if (results.length === 0) {
      return c.json({ error: messages.api.sites.notFound.ja }, 404);
    }
    return c.json(results[0]);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : messages.api.sites.fetchError.ja }, 500);
  }
});
app.put("/api/sites/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { title, url, element } = body;
    if (!title || !url) {
      return c.json({ error: messages.api.sites.validateTitleUrl.ja }, 400);
    }
    const jsonElement = element ? JSON.stringify(element) : "{}";
    const { meta } = await c.env.DB.prepare(
      "UPDATE sites SET title = ?, url = ?, element = ? WHERE id = ?"
    ).bind(title, url, jsonElement, id).run();
    if (meta.changes === 0) {
      return c.json({ error: messages.api.sites.noUpdateData.ja }, 404);
    }
    return c.json({ message: messages.api.sites.updateSuccess.ja });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : messages.api.sites.updateError.ja }, 500);
  }
});
app.delete("/api/sites/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { meta } = await c.env.DB.prepare("DELETE FROM sites WHERE id = ?").bind(id).run();
    if (meta.changes === 0) {
      return c.json({ error: messages.api.sites.deleteNotFound.ja }, 404);
    }
    return c.json({ message: messages.api.sites.deleteSuccessPrefix.ja + id });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : messages.api.sites.deleteError.ja }, 500);
  }
});
app.route("/api/token", d1Route);
var rootApp = new Hono3();
rootApp.route("/api", publicApp);
rootApp.route("/", app);
var PORT2 = Number(process.env.PORT) || 3e3;
console.log(`\u{1F680} Server listening on http://localhost:${PORT2}`);
serve({ fetch: rootApp.fetch, port: PORT2 });
//# sourceMappingURL=d1Server.js.map
