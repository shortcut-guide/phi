import type { Context } from "hono";
import { handleGetPins } from "@/b/models/pinModel";
import { cMessages } from "@/b/config/consoleMessage";

// GET
export async function GetPins(c: Context): Promise<Response> {
  try {
    const offset = c.req.query('offset') ?? 0;
    const limit = c.req.query('limit') ?? 30;
    const results = await handleGetPins(offset, limit);
    return c.json(results, 200);
  } catch (error) {
    return errorResponse("[GET /pins] Error:", error);
  }
}

// 共通エラー出力
function errorResponse(prefix: string, error: unknown): Response {
  const message = error instanceof Error ? error.message : cMessages[4];
  console.error(`${prefix} Error:`, message);
  return new Response(JSON.stringify({ status: "error", message }), {
    status: message === cMessages[2] ? 400 : 500,
    headers: { "Content-Type": "application/json" },
  });
}