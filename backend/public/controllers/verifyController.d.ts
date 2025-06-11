import { Env } from "@/b/types/env";
export declare function handleGetVerifiedStatus({ params, env }: {
    params: any;
    env: Env;
}): Promise<Response>;
export declare function handleCheckVerificationExpiry(context: any): Promise<Response>;
export declare function startVerification(context: any): Promise<Response>;
export declare function completeVerification(context: any): Promise<Response>;
