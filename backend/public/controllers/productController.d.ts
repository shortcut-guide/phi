import type { Context } from "hono";
import type { APIRoute } from "astro";
/**
 * Handle POST requests for creating a product
 */
export declare const POST: APIRoute;
/**
 * Handle PUT requests for updating a product
 */
export declare const PUT: APIRoute;
/**
 * Handle DELETE requests for deleting a product
 */
export declare const DELETE: APIRoute;
/**
 * Handle GET requests for filtered products using Hono
 */
/**
 * Handle GET requests for filtered products using Hono
 */
export declare function GetFilteredProducts(c: Context): Promise<Response>;
