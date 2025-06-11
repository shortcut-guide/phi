import type { Context } from "hono";
import type { APIRoute, APIContext } from "astro";
import type { Site } from "@/b/types/site";

import { cMessages } from "@/b/config/consoleMessage.ts";


/**
 * Handle GET requests for filtered sites
 */
export async function handleGetFilteredSites(c: Context): Promise<Response> {
  try {
    const limit = Number(c.req.query("limit") ?? 100);
    const orderBy = c.req.query("orderBy") ?? "createdAt";

    const { results } = await c.env.DB.prepare(
      `SELECT * FROM sites ORDER BY ${orderBy} DESC LIMIT ?`
    )
      .bind(limit)
      .all();

    return c.json(results, 200);
  } catch (error) {
    console.error("[GET /sites] Error:", error instanceof Error ? error.message : error);
    return c.json({ status: "error", message: cMessages[4] }, 500);
  }
}

/**
 * Handle GET requests for a single site by ID
 */
export async function handleGetSiteByIdFromController(c: Context): Promise<Response> {
  try {
    const id = c.req.param("id");
    const { results } = await c.env.DB.prepare(`SELECT * FROM sites WHERE id = ?`).bind(id).all();

    if (!results || results.length === 0) {
      return c.json({ status: "error", message: "Site not found" }, 404);
    }

    return c.json(results[0], 200);
  } catch (error) {
    console.error("[GET /sites/:id] Error:", error instanceof Error ? error.message : error);
    return c.json({ status: "error", message: cMessages[4] }, 500);
  }
}

/**
 * Handle POST requests for creating a site
 */
export async function handleCreateSiteInController(c: Context): Promise<Response> {
  try {
    const body = await c.req.json();
    const { name, url } = body;

    if (!name || !url) {
      return c.json({ status: "error", message: "Missing required fields" }, 400);
    }

    await c.env.DB.prepare(`INSERT INTO sites (name, url) VALUES (?, ?)`).bind(name, url).run();

    return c.json({ status: "success", message: "Site created successfully" }, 201);
  } catch (error) {
    console.error("[POST /sites] Error:", error instanceof Error ? error.message : error);
    return c.json({ status: "error", message: cMessages[4] }, 500);
  }
}

/**
 * Handle PUT requests for updating a site
 */
export async function handleUpdateSiteInController(c: Context): Promise<Response> {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { name, url } = body;

    if (!name || !url) {
      return c.json({ status: "error", message: "Missing required fields" }, 400);
    }

    await c.env.DB.prepare(`UPDATE sites SET name = ?, url = ? WHERE id = ?`).bind(name, url, id).run();

    return c.json({ status: "success", message: "Site updated successfully" }, 200);
  } catch (error) {
    console.error("[PUT /sites/:id] Error:", error instanceof Error ? error.message : error);
    return c.json({ status: "error", message: cMessages[4] }, 500);
  }
}

/**
 * Handle DELETE requests for deleting a site
 */
export async function handleDeleteSiteInController(c: Context): Promise<Response> {
  try {
    const id = c.req.param("id");

    await c.env.DB.prepare(`DELETE FROM sites WHERE id = ?`).bind(id).run();

    return c.json({ status: "success", message: "Site deleted successfully" }, 200);
  } catch (error) {
    console.error("[DELETE /sites/:id] Error:", error instanceof Error ? error.message : error);
    return c.json({ status: "error", message: cMessages[4] }, 500);
  }
}