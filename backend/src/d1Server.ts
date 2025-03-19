import { Hono } from "hono";
import { cors } from "hono/cors";
import type { D1Database } from "@cloudflare/workers-types";

type Bindings = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// ✅ CORS を有効化
app.use(
    "*",
    cors({
        origin: "*", // ✅ すべてのオリジンからのアクセスを許可
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
    })
);

app.get("/", async (c) => {
    return c.text("Hono API is running!");
});

// ✅ すべてのサイトを取得
app.get("/api/sites", async (c) => {
    try {
        const { results } = await c.env.DB.prepare("SELECT * FROM sites ORDER BY createdAt DESC").all();
        return c.json(results);
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "データの取得に失敗しました。" }, 500);
    }
});

// ✅ 新しいサイトを追加
app.post("/api/sites", async (c) => {
    try {
        const body = await c.req.json();
        const { title, url, element } = body;

        if (!title || !url) {
            return c.json({ error: "title と url は必須です。" }, 400);
        }

        const jsonElement = element ? JSON.stringify(element) : "{}";
        const { meta } = await c.env.DB.prepare(
            "INSERT INTO sites (title, url, element, createdAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP) RETURNING id"
        )
        .bind(title, url, jsonElement)
        .run();

        return c.json({ id: meta.last_row_id });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "データの追加に失敗しました。" }, 500);
    }
});

// ✅ 特定のサイトを取得
app.get("/api/sites/:id", async (c) => {
    try {
        const id = c.req.param("id");
        const { results } = await c.env.DB.prepare("SELECT * FROM sites WHERE id = ?").bind(id).all();

        if (results.length === 0) {
            return c.json({ error: "サイトが見つかりません。" }, 404);
        }

        return c.json(results[0]);
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "データの取得に失敗しました。" }, 500);
    }
});

// ✅ サイトを更新
app.put("/api/sites/:id", async (c) => {
    try {
        const id = c.req.param("id");
        const body = await c.req.json();
        const { title, url, element } = body;

        if (!title || !url) {
            return c.json({ error: "title と url は必須です。" }, 400);
        }

        const jsonElement = element ? JSON.stringify(element) : "{}";
        const { meta } = await c.env.DB.prepare(
            "UPDATE sites SET title = ?, url = ?, element = ? WHERE id = ?"
        )
        .bind(title, url, jsonElement, id)
        .run();

        if (meta.changes === 0) {
            return c.json({ error: "更新するデータが見つかりません。" }, 404);
        }

        return c.json({ message: "更新成功" });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "データの更新に失敗しました。" }, 500);
    }
});

// ✅ サイトを削除
app.delete("/api/sites/:id", async (c) => {
    try {
        const id = c.req.param("id");
        const { meta } = await c.env.DB.prepare("DELETE FROM sites WHERE id = ?").bind(id).run();

        if (meta.changes === 0) {
            return c.json({ error: "削除するデータが見つかりません。" }, 404);
        }

        return c.json({ message: `削除成功: ${id}` });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "データの削除に失敗しました。" }, 500);
    }
});

export default app;