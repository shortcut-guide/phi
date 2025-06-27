// backend/config/d1Client.ts
import { env } from "node:process";
import { D1Database } from "@cloudflare/workers-types";
import type { Env } from "@/b/types/env"; // Make sure this points to your Env type definition

type D1BindingMap = {
  [key: string]: D1Database;
};

const dbBindings: D1BindingMap = {};

export function registerDbBindings(envObj: unknown) {
  const env = envObj as Env;
  const productsDb = env.PRODUCTS_DB;
  const searchLogsDb = env.SEARCHLOGS_DB;
  const profileDb = env.PROFILE_DB;
  
  if (!productsDb || !profileDb || !searchLogsDb) {
    throw new Error("D1 bindings not found in environment");
  }

  dbBindings["products"] = productsDb as D1Database;
  dbBindings["profile"] = profileDb as D1Database;
  dbBindings["search_logs"] = searchLogsDb as D1Database;
}

export function getDb(name: "products" | "profile" | "pup" | "search_logs" | "sites"): D1Database {
  const db = dbBindings[name];
  if (!db) throw new Error(`D1 DB '${name}' not registered`);
  return db;
}