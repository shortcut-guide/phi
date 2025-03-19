import { Hono } from "hono";
import type { D1Database } from "@cloudflare/workers-types";

// Cloudflare Workers の環境変数 (D1 DB の型)
type Bindings = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// データ取得
app.get("/api/contents", async (c) => {
    const { results } = await c.env.DB.prepare("SELECT * FROM contents ORDER BY createdAt DESC").all();
    return c.json(results);
});

// データ追加
app.post("/api/contents", async (c) => {
    const body = await c.req.json();
    const { title, body: contentBody, visible } = body;

    const { meta } = await c.env.DB.prepare(
        "INSERT INTO contents (title, body, visible, createdAt) VALUES (?, ?, ?, datetime('now')) RETURNING id"
    )
    .bind(title, contentBody, visible)
    .run();

    return c.json({ id: meta.last_row_id });
});

// データ削除
app.delete("/api/contents/:id", async (c) => {
    const id = c.req.param("id");
    const { meta } = await c.env.DB.prepare("DELETE FROM contents WHERE id = ?").bind(id).run();

    if (meta.changes > 0) {
        return c.json({ message: `削除成功: ${id}` });
    } else {
        return c.json({ error: "削除に失敗しました。" }, 500);
    }
});

export default app;