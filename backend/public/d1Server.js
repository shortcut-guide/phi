// src/d1Server.ts
import { Hono as Hono4 } from "hono";
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
var SITE_DB = required("CLOUDFLARE_D1_DATABASE_SITES");
var SEARCHLOGS_DB = required("CLOUDFLARE_D1_DATABASE_SEARCH_LOGS");
var PRODUCTS_DB = required("CLOUDFLARE_D1_DATABASE_PRODUCTS");
var PROFILE_DB = required("CLOUDFLARE_D1_DATABASE_PROFILE");
var PUP_DB = required("CLOUDFLARE_D1_DATABASE_PUP");
var PAYPAL_CLIENT_ID = required("PAYPAL_CLIENT_ID");
var PAYPAL_SECRET = required("PAYPAL_SECRET");
var PAYPAL_API_BASE = required("PAYPAL_API_BASE");
var IMGUR_CLIENT_ID = required("IMGUR_CLIENT_ID");

// src/utils/d1.ts
var lang = getLang();
var t = messages.utilsD1?.[lang];
var DB;
var getD1Product = () => {
  DB = PRODUCTS_DB;
  if (!DB)
    throw new Error(t.ErrorPRODUCTS_DB);
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
productRoutes.get("/", (c) => {
  console.log("matched GET /api/products \u2192", c.req.path);
  return handleGetProducts(c);
});

// src/routes/sites.ts
import { Hono as Hono3 } from "hono";

// src/controllers/sitesController.ts
async function handleGetFilteredSites(c) {
  try {
    const limit = Number(c.req.query("limit") ?? 100);
    const orderBy = c.req.query("orderBy") ?? "createdAt";
    const { results } = await c.env.DB.prepare(
      `SELECT * FROM sites ORDER BY ${orderBy} DESC LIMIT ?`
    ).bind(limit).all();
    return c.json(results, 200);
  } catch (error) {
    console.error("[GET /sites] Error:", error instanceof Error ? error.message : error);
    return c.json({ status: "error", message: cMessages[4] }, 500);
  }
}
async function handleGetSiteByIdFromController(c) {
  try {
    const id = c.req.param("id");
    const { results } = await c.env.DB.prepare(`SELECT * FROM sites WHERE id = ?`).bind(id).all();
    if (!results || results.length === 0) {
      return c.json({ status: "error", message: "Site not found" }, 404);
    }
    return c.json(results[0], 200);
  } catch (error) {
    console.error("[GET /sites/:id] Error:", error instanceof Error ? error.message : error);
    return c.json({ status: "error", message: cMessages[4] }, 500);
  }
}
async function handleCreateSiteInController(c) {
  try {
    const body = await c.req.json();
    const { name, url } = body;
    if (!name || !url) {
      return c.json({ status: "error", message: "Missing required fields" }, 400);
    }
    await c.env.DB.prepare(`INSERT INTO sites (name, url) VALUES (?, ?)`).bind(name, url).run();
    return c.json({ status: "success", message: "Site created successfully" }, 201);
  } catch (error) {
    console.error("[POST /sites] Error:", error instanceof Error ? error.message : error);
    return c.json({ status: "error", message: cMessages[4] }, 500);
  }
}
async function handleUpdateSiteInController(c) {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { name, url } = body;
    if (!name || !url) {
      return c.json({ status: "error", message: "Missing required fields" }, 400);
    }
    await c.env.DB.prepare(`UPDATE sites SET name = ?, url = ? WHERE id = ?`).bind(name, url, id).run();
    return c.json({ status: "success", message: "Site updated successfully" }, 200);
  } catch (error) {
    console.error("[PUT /sites/:id] Error:", error instanceof Error ? error.message : error);
    return c.json({ status: "error", message: cMessages[4] }, 500);
  }
}
async function handleDeleteSiteInController(c) {
  try {
    const id = c.req.param("id");
    await c.env.DB.prepare(`DELETE FROM sites WHERE id = ?`).bind(id).run();
    return c.json({ status: "success", message: "Site deleted successfully" }, 200);
  } catch (error) {
    console.error("[DELETE /sites/:id] Error:", error instanceof Error ? error.message : error);
    return c.json({ status: "error", message: cMessages[4] }, 500);
  }
}

// src/api/sites.ts
async function handleGetSites(c) {
  return await handleGetFilteredSites(c);
}
async function handleGetSiteById(c) {
  return await handleGetSiteByIdFromController(c);
}
async function handleCreateSite(c) {
  return await handleCreateSiteInController(c);
}
async function handleUpdateSite(c) {
  return await handleUpdateSiteInController(c);
}
async function handleDeleteSite(c) {
  return await handleDeleteSiteInController(c);
}

// src/routes/sites.ts
var siteRoutes = new Hono3();
siteRoutes.get("/", handleGetSites);
siteRoutes.get("/:id", handleGetSiteById);
siteRoutes.post("/", handleCreateSite);
siteRoutes.put("/:id", handleUpdateSite);
siteRoutes.delete("/:id", handleDeleteSite);

// src/views/index.ts
function renderIndex() {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <title>Phis</title>
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'self'; font-src 'self' data:; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';">
  <style>
    body { font-family: sans-serif; margin: 2rem; }
  </style>
</head>
<body>
  <h1>\u2705 Phis is running</h1>
  <p>You can now access your API endpoints.</p>
</body>
</html>`;
}

// src/d1Server.ts
var rootApp = new Hono4();
var adminApp = new Hono4();
var apiApp = new Hono4();
rootApp.use(
  "*",
  cors({
    origin: "*",
    // ✅ すべてのオリジンからのアクセスを許可
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"]
  })
);
rootApp.use("*", async (c, next) => {
  c.header(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';"
  );
  await next();
});
rootApp.get("/admin", (c) => c.html(renderIndex()));
rootApp.route("/admin", adminApp);
rootApp.route("/api", apiApp);
apiApp.route("/token", tokenRoutes);
apiApp.route("/products", productRoutes);
apiApp.route("/sites", siteRoutes);
rootApp.get("/admin/", (c) => c.redirect("/admin", 301));
rootApp.get("/api/token/", (c) => c.redirect("/api/token", 301));
rootApp.get("/api/products/", (c) => c.redirect("/api/products", 301));
rootApp.get("/api/sites/", (c) => c.redirect("/api/sites", 301));
rootApp.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});
var PORT2 = Number(process.env.PORT) || 3e3;
console.log(`\u{1F680} Server listening on http://localhost:${PORT2}`);
serve({ fetch: rootApp.fetch, port: PORT2 });
//# sourceMappingURL=d1Server.js.map
