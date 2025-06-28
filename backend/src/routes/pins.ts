import { Hono } from 'hono';
import { GetPins } from "@/b/controllers/pinController";

export function pinsRoutes() {
  const app = new Hono();

  app.get('/', async (c: Context) => {
    console.log("[pinsRoutes] GET /api/pins invoked, path =", c.req.path);
    const resp = await GetPins(c);
    const data = (await resp.json()) as any;
    return c.json(data, 200);
  });

  return app;
}