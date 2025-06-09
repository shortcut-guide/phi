import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from '@hono/node-server';
import type { D1Database } from "@cloudflare/workers-types";
import { d1Route } from '@/b/routes/token';
import productRoutes from '@/b/routes/products';
import { renderIndex } from "@/b/views/index";
import { messages } from '@/b/config/messageConfig';

type Bindings = {
    DB: D1Database;
};

const publicApp = new Hono<{ Bindings: Bindings }>();
publicApp.route('/api', productRoutes);

const app = new Hono<{ Bindings: Bindings }>().basePath('/admin');

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

app.get("/", async (c) => {
    const html = renderIndex();
    return c.html(html);
});

// ✅ すべてのサイトを取得
app.get("/api/sites", async (c) => {
    try {
        const { results } = await c.env.DB.prepare("SELECT * FROM sites ORDER BY createdAt DESC").all();
        return c.json(results);
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : messages.api.sites.fetchError.ja }, 500);
    }
});

// ✅ 新しいサイトを追加
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
        )
        .bind(title, url, jsonElement)
        .run();

        return c.json({ id: meta.last_row_id });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : messages.api.sites.insertError.ja }, 500);
    }
});

// ✅ 特定のサイトを取得
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

// ✅ サイトを更新
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
        )
        .bind(title, url, jsonElement, id)
        .run();

        if (meta.changes === 0) {
            return c.json({ error: messages.api.sites.noUpdateData.ja }, 404);
        }

        return c.json({ message: messages.api.sites.updateSuccess.ja });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : messages.api.sites.updateError.ja }, 500);
    }
});

// ✅ サイトを削除
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

// ✅ トークン関連のルートを追加
app.route("/api/token", d1Route);

const rootApp = new Hono<{ Bindings: Bindings }>();
rootApp.route('/api', publicApp);
rootApp.route('/', app);
const PORT = Number(process.env.PORT) || 3000;
console.log(`🚀 Server listening on http://localhost:${PORT}`);
serve({ fetch: rootApp.fetch, port: PORT });