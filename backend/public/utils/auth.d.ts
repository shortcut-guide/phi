import type { Env } from "@/b/types/env";
/**
 * JWTをHMAC検証し、ペイロードの user_id を返す。
 */
export declare function getUserIdFromRequest(req: Request, env: Env): Promise<string | null>;
/**
 * リクエストからuser_idを取得し、存在しなければ401をthrowする
 */
export declare function getAndAssertUserId(req: Request, env: Env): Promise<string>;
