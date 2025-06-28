// backend/src/controllers/profileController.ts
import { Context } from 'hono';
import { getUserProfile, upsertUserProfile } from '@/b/models/userProfile';

export async function getProfile(c: Context): Promise<Response> {
  const user_id = c.req.query('user_id');
  if (!user_id) return c.text('Missing user_id', 400);

  const result = await getUserProfile(user_id);
  return c.json(result, 200);
}

export async function saveProfile(c: Context): Promise<Response> {
  const body = await c.req.json();
  const { user_id, nickname, bio, avatar_url } = body;

  if (!user_id) return c.text('Missing user_id', 400);

  await upsertUserProfile({ user_id, nickname, bio, avatar_url });
  return c.text('Profile updated', 200);
}
