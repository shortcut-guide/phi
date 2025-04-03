import { Hono } from 'hono';
import { getToken, saveToken, updateToken, deleteToken } from '../services/tokenService';

export const tokenRoute = new Hono<{ Bindings: { DB: D1Database } }>();

// ✅ トークンを取得
tokenRoute.get('/api/token', async (c) => {
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
tokenRoute.post('/api/token', async (c) => {
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
tokenRoute.put('/api/token', async (c) => {
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
tokenRoute.delete('/api/token', async (c) => {
  try {
    const body = await c.req.json();
    if (!body || !body.token) {
      return c.json({ error: 'トークンが必要です。' }, 400);
    }
    await deleteTokens(c.env.DB);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "トークンの削除に失敗しました。" }, 500);
  }
});