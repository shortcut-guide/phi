import { Hono } from 'hono';
import { getToken, saveToken, updateToken, deleteToken } from '@/b/services/token';

export const d1Route = new Hono<{ Bindings: { DB: D1Database } }>();

// ✅ トークンを取得
d1Route.get('/api/token', async (c) => {
  try {
    const token = await getToken(c.env.DB);
    if (!token || !token.token) {
      return c.json({ error: 'トークンが必要です。' }, 400);
    }
    return c.json(token);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "トークンの取得に失敗しました。" }, 500);
  }
});

// ✅ トークンを保存
d1Route.post('/api/token', async (c) => {
  try {
    const body = await c.req.json();
    if (!body || !body.token) {
      return c.json({ error: 'トークンが必要です。' }, 400);
    }
    await saveToken(c.env.DB, body);
    return c.json({ status: 'saved' });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "トークンの保存に失敗しました。" }, 500);
  }
});

// ✅ トークンを更新
d1Route.put('/api/token', async (c) => {
  try {
    const body = await c.req.json();
    if (!body || !body.token) {
      return c.json({ error: 'トークンが必要です。' }, 400);
    }
    await updateToken(c.env.DB, body);
    return c.json({ status: 'updated' });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "トークンの更新に失敗しました。" }, 500);
  }
});

// ✅ トークンを削除
d1Route.delete('/api/token', async (c) => {
  try {
    const body = await c.req.json();
    if (!body || !body.token) {
      return c.json({ error: 'トークンが必要です。' }, 400);
    }
    await deleteToken(c.env.DB);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "トークンの削除に失敗しました。" }, 500);
  }
});