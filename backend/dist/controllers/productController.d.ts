import { Context } from "hono";
import type { APIRoute } from "astro";
import type { Product } from "@/b/types/product";
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
export declare function handleGetFilteredProducts(c?: Context): Promise<D1Result<unknown> | Product[] | (Response & import("hono").TypedResponse<{
    success: true;
    meta: {
        [x: string]: never;
        duration: number;
        size_after: number;
        rows_read: number;
        rows_written: number;
        last_row_id: number;
        changed_db: boolean;
        changes: number;
        served_by_region?: string | undefined;
        served_by_primary?: boolean | undefined;
        timings?: {
            sql_duration_ms: number;
        } | undefined;
    };
    results: never[];
} | {
    id: string;
    name: string;
    shop_name: string;
    platform: string;
    base_price: number;
    ec_data: string;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}[], 200, "json">) | (Response & import("hono").TypedResponse<{
    status: string;
    message: string;
}, 500, "json">)>;
