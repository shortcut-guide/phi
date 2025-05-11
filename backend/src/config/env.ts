// backend/src/config/env.ts
import * as dotenv from 'dotenv';

const envFile = process.env.ENV_FILE || '.env.production';
dotenv.config({ path: envFile });

declare global {
  const env: {
    CLOUDFLARE_D1_DATABASE_PUP?: string;
    CLOUDFLARE_D1_DATABASE_SEARCH_LOGS?: string;
  };
}

Object.defineProperty(globalThis, 'env', {
  value: {
    CLOUDFLARE_D1_DATABASE_PUP: process.env.CLOUDFLARE_D1_DATABASE_PUP,
    CLOUDFLARE_D1_DATABASE_SEARCH_LOGS: process.env.CLOUDFLARE_D1_DATABASE_SEARCH_LOGS,
    CLOUDFLARE_D1_DATABASE_PROFILE: process.env.CLOUDFLARE_D1_DATABASE_PROFILE
  },
  writable: false,
});