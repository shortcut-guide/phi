// backend/config/d1Client.ts
import { env } from "node:process";
import { D1Database } from "@cloudflare/workers-types";

type D1BindingMap = {
  [key: string]: D1Database;
};

const dbBindings: D1BindingMap = {};

export function registerDbBindings(envObj: Record<string, unknown>) {
  const productsDb = envObj[env.PRODUCTS_DB_BINDING ?? "products"];
  const pupDb = envObj[env.PUP_DB_BINDING ?? "pup"];
  const serarchLogsDb = envObj[env.SEARCH_LOGS_DB_BINDING ?? "search_logs"];
  const sitesDb = envObj[env.SITES_DB_BINDING ?? "sites"];
  const profileDb = envObj[env.PROFILE_DB_BINDING ?? "profile"];

  if (!productsDb || !profileDb || !pupDb || !serarchLogsDb || !sitesDb) {
    throw new Error("D1 bindings not found in environment");
  }

  dbBindings["products"] = productsDb as D1Database;
  dbBindings["profile"] = profileDb as D1Database;
  dbBindings["pup"] = pupDb as D1Database;
  dbBindings["search_logs"] = serarchLogsDb as D1Database;
  dbBindings["sites"] = sitesDb as D1Database;
}

export function getDb(name: "products" | "profile" | "pup" | "search_logs" | "sites"): D1Database {
  const db = dbBindings[name];
  if (!db) throw new Error(`D1 DB '${name}' not registered`);
  return db;
}