// backend/api/pins.ts
import type { APIRoute } from "astro";
import { Context } from "hono";
import { getPins } from "@/b/models/pinModel";
import { setCORSHeaders } from "@/b/utils/cors";

export async function handleGetPins(c: Context){
  const offset = Number(c.req.query('offset') ?? 0);
  const limit = Number(c.req.query('limit') ?? 30);
  const items = await getPins(offset, limit);

  return setCORSHeaders(
    new Response(JSON.stringify(items), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  );

}