import { getPins } from "@/b/models/pinModel";
import { setCORSHeaders } from "@/b/utils/cors";
export async function handleGetPins(c) {
    const offset = Number(c.req.query('offset') ?? 0);
    const limit = Number(c.req.query('limit') ?? 30);
    const items = await getPins(offset, limit);
    return setCORSHeaders(new Response(c.json(items), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    }));
}
