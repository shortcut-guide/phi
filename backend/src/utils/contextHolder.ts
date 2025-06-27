// backend/src/utils/contextHolder.ts

import type { Context } from 'hono';
import type { D1Database } from '@cloudflare/workers-types';

type Env = {
  SITE_DB?: D1Database;
  SEARCHLOGS_DB?: D1Database;
  PROFILE_DB?: D1Database;
  PRODUCTS_DB?: D1Database;
};

let currentContext: Context | null = null;

export const setContext = (c: Context) => {
  currentContext = c;
};

export const getContext = (): Context => {
  if (!currentContext) throw new Error('Context not set');
  return currentContext;
};

export const getD1Client = (key: keyof Env): D1Database => {
  const ctx = getContext();
  const db = ctx.env?.[key];
  if (!db) throw new Error(`D1Database "${key}" is not bound.`);
  return db;
};