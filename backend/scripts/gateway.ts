// scripts/gateway.ts
import * as express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { addAuthHeader } from '@/b/utils/authHeader';
import productsModules from '@/b/d1-worker/products/index';

const app = express();
const PRODUCTS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjhlYTkwNTkxNjNmM2ZkOGRmM2I2ZjUxMmQzYWIzZiIsImlhdCI6MTc1MTE0NTQ4OCwiZXhwIjoxNzUxMTg4Njg4fQ.WJFn1BRzqCYRqPAGGAaABv244g6NqVJXMX3P8C1nsbk";
const SEARCHLOGS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZmVhNDUzOTA0MDJiODQxMGQ0ZTc5NGQ3MjRlMWUyYyIsImlhdCI6MTc1MTE0NTU1NiwiZXhwIjoxNzUxMTg4NzU2fQ.odQKu2HsaI6jiydSpPtH_fw5NgC6IH-Ho-UbYjYFtrs";
const PROFILE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMmU4MzAwNmFjYzc3YjY3ODVjNTJhNGQxYzUyZThkZSIsImlhdCI6MTc1MTE0NTU3OSwiZXhwIjoxNzUxMTg4Nzc5fQ._7jMtn29ec-TkaqpvAudzqWJdO_YkmrKUzr5q8wew9s";

// D1 モジュール群を動的ルーティング
Object.entries(productsModules).forEach(([key, module]) => {
  app.get(
    `/api/products/${key}`,
    addAuthHeader(PRODUCTS_TOKEN),
    async (req, res, next) => {
      try {
        const handler = (module.getProducts ?? module) as Function;
        const data = await handler(req, res);
        res.json(data);
      } catch (err) {
        next(err);
      }
    },
  );
});

// プロキシ
app.use(
  '/api/products',
  addAuthHeader(PRODUCTS_TOKEN),
  createProxyMiddleware({ target: 'http://localhost:3001',changeOrigin: true }
));
app.use(
  '/api/searchlogs',
  addAuthHeader(SEARCHLOGS_TOKEN),
  createProxyMiddleware({ target: 'http://localhost:3002',changeOrigin: true }
));
app.use(
  '/api/profile',
  addAuthHeader(PROFILE_TOKEN),
  createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true }
));
app.listen(3000, () => {
  console.log('🌀 Gateway running at http://localhost:3000');
});
