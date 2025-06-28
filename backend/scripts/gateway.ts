// scripts/gateway.ts
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use('/api/products', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/api/searchlogs', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));

app.listen(3000, () => {
  console.log('🌀 Gateway running at http://localhost:3000');
});
