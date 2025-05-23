// backend/src/config/env.ts
import {config} from 'dotenv';

config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const SEARCHLOGS_DB = required("CLOUDFLARE_D1_DATABASE_SEARCH_LOGS");
export const PRODUCTS_DB = required("CLOUDFLARE_D1_DATABASE_PRODUCTS");
export const PROFILE_DB = required("CLOUDFLARE_D1_DATABASE_PROFILE");
export const PUP_DB = required("CLOUDFLARE_D1_DATABASE_PUP");
export const PAYPAL_CLIENT_ID = required("PAYPAL_CLIENT_ID");
export const PAYPAL_SECRET = required("PAYPAL_SECRET");
export const PAYPAL_API_BASE = required("PAYPAL_API_BASE");