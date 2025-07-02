"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const publicDir = path_1.default.join(__dirname, "../../frontend/public");
// /api へのリクエストはバックエンドにプロキシ
app.use("/api", (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: "http://localhost:8787",
    changeOrigin: true,
}));
// 静的ファイル配信
app.use(express_1.default.static(publicDir));
// HTMLファイルの lang 属性を Accept-Language で書き換える
app.get("*", async (req, res, next) => {
    let urlPath = req.path === "/" ? "/index.html" : req.path;
    // URLが .html で終わっていない場合はSPA的に index.html を返す
    if (!urlPath.endsWith(".html")) {
        urlPath = "/index.html";
    }
    try {
        const filePath = path_1.default.join(publicDir, urlPath);
        let html = await promises_1.default.readFile(filePath, "utf-8");
        const acceptLang = req.headers["accept-language"] || "";
        const lang = acceptLang.startsWith("ja") ? "ja" : "en";
        html = html.replace(/<html lang="__PLACEHOLDER__"/, `<html lang="${lang}"`);
        res.setHeader("Content-Type", "text/html");
        res.send(html);
    }
    catch (err) {
        res.status(404).send("Not found");
    }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Lang rewriting server running at http://localhost:${port}`);
});
