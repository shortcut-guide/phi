import dotenv from "dotenv";
dotenv.config();

// ここからサーバーの処理を実行
import express from "express";
import apiHelper from "./utils/MicrocmsHelper.ts";

const app = express();

app.get("/", async (req, res) => {
    try {
        const data = await apiHelper.get("sites");
        res.json(data);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "予期しないエラーが発生しました。" });
        }
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));