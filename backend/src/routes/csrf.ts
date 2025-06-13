import { Hono } from 'hono';
import { generateCSRFToken } from '@/b/utils/csrf';

export const csrfRoutes = new Hono();

csrfRoutes.get('/csrf', (c) => {
  const token = generateCSRFToken();
  return c.json({ token }, 200);
});