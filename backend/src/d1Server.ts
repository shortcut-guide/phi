import type { D1Database } from "@cloudflare/workers-types";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from '@hono/node-server';
import { tokenRoutes } from '@/b/routes/token';
import { productRoutes } from '@/b/routes/products';
import { siteRoutes } from '@/b/routes/sites';
import { renderIndex } from "@/b/views/index";

// ✅ ルートの設定
const publicApp = new Hono<{ Bindings: { DB: D1Database } }>();
const app = new Hono<{ Bindings: { DB: D1Database } }>().basePath('/admin');

// ✅ CORS を有効化
app.use(
    "*",
    cors({
        origin: "*", // ✅ すべてのオリジンからのアクセスを許可
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
    })
);

// Content Security Policy: allow fonts from self and data URIs
app.use("*", async (c, next) => {
    c.header(
        "Content-Security-Policy",
        "default-src 'self'; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';"
    );
    await next();
});

app.notFound((c) => {
    return c.json({ error: "Not Found" }, 404);
});

app.notFound((c) => {
    return c.json({ error: "Not Found" }, 403);
});

app.notFound((c) => {
    return c.json({ error: "Not Found" }, 503);
});

app.get("/", async (c) => {
    console.log("Root route accessed");
    const html = renderIndex();
    return c.html(html);
});

// ✅ トークン関連のルートを追加
app.route('/', app);
app.route("/api/token", tokenRoutes);
publicApp.route('/api', productRoutes);
publicApp.route('/api/sites', siteRoutes);

const PORT = Number(process.env.PORT) || 3000;
console.log(`🚀 Server listening on http://localhost:${PORT}`);
serve({ fetch: app.fetch, port: PORT });