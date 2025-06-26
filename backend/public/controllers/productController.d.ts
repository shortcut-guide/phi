import type { Context } from "hono";
import type { APIRoute } from "astro";
export declare const POST: APIRoute;
export declare const PUT: APIRoute;
export declare const DELETE: APIRoute;
export declare function GetFilteredProducts(c: Context): Promise<Response>;
