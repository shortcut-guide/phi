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

app.get(/^(.+)\/index\.html$/, (req, res) => {
  res.redirect(301, req.params[0] + "/");
});

// HTMLファイルの lang 属性を Accept-Language で書き換える
app.get("*", async (req, res, next) => {
  let urlPath = req.path === "/" ? "/index.html" : req.path;

  // ↓ 静的ファイルへのリクエストはスルー
  if (
    urlPath.match(/\.(js|mjs|css|png|jpe?g|webp|gif|svg|ico|json|txt|map)$/i) ||
    urlPath.startsWith('/assets/') ||
    urlPath.startsWith('/_astro/')
  ) {
    return next();
  }

  const hasExtension = path.extname(urlPath);
  if (!hasExtension) {
    // Try to map to a directory's index.html if available
    const tryIndex = path.join(publicDir, urlPath, "index.html");
    try {
      await fs.access(tryIndex);
      urlPath = path.join(urlPath, "index.html");
    } catch {
      // fallback to root index.html if not found
      urlPath = "/index.html";
    }
  }

  try {
    const filePath = path.join(publicDir, urlPath);
    let html = await fs.readFile(filePath, "utf-8");

    const acceptLang = req.headers["accept-language"] || "";
    const lang = acceptLang.startsWith("ja") ? "ja" : "en";
    
    html = html.replace(
      /<html\b[^>]*lang=['"]__PLACEHOLDER__['"][^>]*>/i,
      (htmlTag) => {
        const replaced = htmlTag.replace(/lang=['"]__PLACEHOLDER__['"]/, `lang="${lang}"`);
        return replaced;
      }
    );

    // Astro内の __MSG_LANG__ を書き換え
    html = html.replace(/__MSG_LANG__/g, lang);

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    res.status(404).send("Not found");
  }
});

// 静的ファイル配信
app.use(express.static(publicDir));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Lang rewriting server running at http://localhost:${port}`);
});