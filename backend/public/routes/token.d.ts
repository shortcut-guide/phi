import { Hono } from 'hono';
export declare const tokenRoutes: Hono<{
    Bindings: {
        DB: D1Database;
    };
}, import("hono/types").BlankSchema, "/">;
