// backend/api/pins.ts
import type { APIRoute } from "astro";
import { getPins } from "@/b/models/pinModel";
import { setCORSHeaders } from "@/b/utils/cors";

export const GET: APIRoute = async ({ url }) => {
  const offset = Number(url.searchParams.get("offset") || "0");
  const limit = 30; // 1回で30件取得

  const items = await getPins(offset, limit);

  return setCORSHeaders(
    new Response(JSON.stringify(items), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  );
};