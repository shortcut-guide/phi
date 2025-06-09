import type { D1Database } from "@cloudflare/workers-types";
type Env = {
    CLOUDFLARE_D1_DATABASE_PROFILE: D1Database;
};
declare const _default: {
    fetch(request: Request, env: Env): Promise<Response>;
};
export default _default;
