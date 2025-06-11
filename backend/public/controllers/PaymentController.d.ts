import { Env } from "@/b/types/env";
export declare function handleGetPayment({ env }: {
    env: Env;
}): Promise<Response>;
export declare function handleSetPayment({ request }: {
    request: Request;
}): Promise<Response>;
