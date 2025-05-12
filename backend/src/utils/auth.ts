import type { Env } from "@/b/types/env";
/**
 * JWTをHMAC検証し、ペイロードの user_id を返す。
 */
export async function getUserIdFromRequest(req: Request, env: Env): Promise<string | null> {
  const header = req.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;

  const token = header.replace("Bearer ", "").trim();
  const [headerB64, payloadB64, signatureB64] = token.split(".");

  if (!headerB64 || !payloadB64 || !signatureB64) return null;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64urlToBuffer(signatureB64),
    new TextEncoder().encode(`${headerB64}.${payloadB64}`)
  );

  if (!valid) return null;

  try {
    const json = JSON.parse(new TextDecoder().decode(base64urlToBuffer(payloadB64)));
    return json.user_id || null;
  } catch {
    return null;
  }
}

/**
 * base64url → Uint8Array 変換ユーティリティ
 */
function base64urlToBuffer(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/") + "==".slice((base64url.length + 3) % 4);
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

/**
 * リクエストからuser_idを取得し、存在しなければ401をthrowする
 */
export async function getAndAssertUserId(req: Request, env: Env): Promise<string> {
  const user_id = await getUserIdFromRequest(req, env);
  if (!user_id) {
    throw new Response(
      JSON.stringify({ error: "unauthorized: user_id required" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  return user_id;
}
