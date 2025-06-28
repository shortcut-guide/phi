// backend/src/routes/profile.ts
import { Hono } from 'hono';
import * as ProfileController from '@/b/controllers/profileController';

export function profileRoutes() {
  const app = new Hono();

  app.get('/profile', ProfileController.getProfile);
  app.post('/profile', ProfileController.saveProfile);

  return app;
}
