import { Hono } from 'hono';
export declare const d1Route: Hono<{
    Bindings: {
        DB: D1Database;
    };
}, import("hono/types").BlankSchema, "/">;
