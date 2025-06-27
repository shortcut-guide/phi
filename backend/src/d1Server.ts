import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from '@hono/node-server';
import type { Env } from "@/b/types/env";
import { tokenRoutes } from '@/b/routes/token';
import { productRoutes } from '@/b/routes/products';
import { renderIndex } from "@/b/views/index";

const app = new Hono<{ Bindings: Env }>();

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

app.route("/api/token", tokenRoutes);
app.route("/api/products", productRoutes);
app.get("/api/token/", (c) => c.redirect("/api/token", 301));
app.get('/api/products/', (c) => c.redirect('/api/products', 301));

app.notFound((c) => {
    return c.json({ error: "Not Found" }, 404);
});

const PORT = Number(process.env.PORT) || 3000;

console.log(`🚀 Server listening on http://localhost:${PORT}`);
serve({ fetch: app.fetch, port: PORT });