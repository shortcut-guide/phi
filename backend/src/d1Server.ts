import type { D1Database } from "@cloudflare/workers-types";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from '@hono/node-server';
import { tokenRoutes } from '@/b/routes/token';
import { productRoutes } from '@/b/routes/products';
import { siteRoutes } from '@/b/routes/sites';
import { renderIndex } from "@/b/views/index";

// メインアプリ
const rootApp = new Hono<{ Bindings: { DB: D1Database } }>();

// 管理用サブアプリ
const adminApp = new Hono<{ Bindings: { DB: D1Database } }>();

// API用サブアプリ
const apiApp = new Hono<{ Bindings: { DB: D1Database } }>();

// ✅ CORS を有効化
rootApp.use(
    "*",
    cors({
        origin: "*", // ✅ すべてのオリジンからのアクセスを許可
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
    })
);

// Content Security Policy: allow fonts from self and data URIs
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
rootApp.get('/api/products/', (c) => c.redirect('/api/products', 301));
rootApp.get('/api/sites/', (c) => c.redirect('/api/sites', 301));

rootApp.notFound((c) => {
    return c.json({ error: "Not Found" }, 404);
});

const PORT = Number(process.env.PORT) || 3000;
console.log(`🚀 Server listening on http://localhost:${PORT}`);
serve({ fetch: rootApp.fetch, port: PORT });