// scripts/gateway.ts
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
// Bearer token middleware for each route
function addAuthHeader(token: string) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.headers['authorization'] = `Bearer ${token}`;
    next();
  };
}

app.use('/products', addAuthHeader('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjhlYTkwNTkxNjNmM2ZkOGRmM2I2ZjUxMmQzYWIzZiIsImlhdCI6MTc1MTE0NTQ4OCwiZXhwIjoxNzUxMTg4Njg4fQ.WJFn1BRzqCYRqPAGGAaABv244g6NqVJXMX3P8C1nsbk'),createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/searchlogs', addAuthHeader('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZmVhNDUzOTA0MDJiODQxMGQ0ZTc5NGQ3MjRlMWUyYyIsImlhdCI6MTc1MTE0NTU1NiwiZXhwIjoxNzUxMTg4NzU2fQ.odQKu2HsaI6jiydSpPtH_fw5NgC6IH-Ho-UbYjYFtrs'),createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));
app.use('/profile', addAuthHeader('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMmU4MzAwNmFjYzc3YjY3ODVjNTJhNGQxYzUyZThkZSIsImlhdCI6MTc1MTE0NTU3OSwiZXhwIjoxNzUxMTg4Nzc5fQ._7jMtn29ec-TkaqpvAudzqWJdO_YkmrKUzr5q8wew9s'),createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true }));

app.listen(3000, () => {
  console.log('🌀 Gateway running at http://localhost:3000');
});
