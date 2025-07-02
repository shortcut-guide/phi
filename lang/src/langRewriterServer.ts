import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import fs from "fs/promises";
import path from "path";

const app = express();
const publicDir = path.join(__dirname, "../../frontend/public");

// /api へのリクエストはバックエンドにプロキシ
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:8787",
    changeOrigin: true,
  })
);

// 静的ファイル配信
app.use(express.static(publicDir));

// HTMLファイルの lang 属性を Accept-Language で書き換える
app.get("*", async (req, res, next) => {
  let urlPath = req.path === "/" ? "/index.html" : req.path;

  // URLが .html で終わっていない場合はSPA的に index.html を返す
  if (!urlPath.endsWith(".html")) {
    urlPath = "/index.html";
  }

  try {
    const filePath = path.join(publicDir, urlPath);
    let html = await fs.readFile(filePath, "utf-8");

    const acceptLang = req.headers["accept-language"] || "";
    const lang = acceptLang.startsWith("ja") ? "ja" : "en";
    html = html.replace(/<html lang="__PLACEHOLDER__"/, `<html lang="${lang}"`);

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    res.status(404).send("Not found");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Lang rewriting server running at http://localhost:${port}`);
});