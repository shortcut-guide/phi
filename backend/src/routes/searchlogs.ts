// backend/routes/searchlogs.ts

import { Hono } from 'hono';
import * as SearchController from '@/b/controllers/searchController';

export function searchRoutes() {
  const app = new Hono();

  const routeDefinitions = [
    { method: 'get', path: '/search', handler: SearchController.Search },
    { method: 'post', path: '/search/click', handler: SearchController.ClickLog },
    { method: 'get', path: '/search/analytics', handler: SearchController.Analytics },
    { method: 'get', path: '/search/suggest', handler: SearchController.Suggest },
  ] as const;

  for (const { method, path, handler } of routeDefinitions) {
    app[method](path, handler);
  }

  return app;
}
