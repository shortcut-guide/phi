import express from "express";
import { D1Helper } from "./utils/D1Helper";

const app = express();
app.use(express.json());

// Cloudflare D1 のデータベース接続 (ローカル環境用)
const db = new D1Helper(globalThis.D1_DATABASE);

// すべてのデータを取得
app.get("/api/contents", async (req, res) => {
    try {
        const data = await db.getAllContents();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "予期しないエラーが発生しました。" });
    }
});

// データを追加
app.post("/api/contents", async (req, res) => {
    try {
        const { title, body, visible } = req.body;
        const id = await db.insertContent(title, body, visible);
        res.json({ id });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "データの追加に失敗しました。" });
    }
});

// データを削除
app.delete("/api/contents/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const success = await db.deleteContent(Number(id));
        if (success) {
            res.json({ message: `削除成功: ${id}` });
        } else {
            res.status(500).json({ error: "削除に失敗しました。" });
        }
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "データの削除に失敗しました。" });
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));