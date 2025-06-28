import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from '@hono/node-server';
import { tokenRoutes } from '@/b/routes/token';
import { renderIndex } from "@/b/views/index";
import { getServiceConfig } from "@/b/config/routeConfig";

const app = new Hono();

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

const service = process.argv[2];
const config = getServiceConfig(service);

if (!config) {
  throw new Error(`Unknown service: ${service}`);
}

app.route(`/api/${service}`, config.routes);
app.notFound((c) => c.json({ error: "Not Found" }, 404));

const PORT = Number(process.env.PORT) || 3000;
console.log(`🚀 Server listening on http://localhost:${PORT}`);
serve({ fetch: app.fetch, port: PORT });