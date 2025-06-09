import '@/b/config/env';
export declare function getAccessTokenFromCode(code: string): Promise<string>;
export declare function getUserInfoFromToken(token: string): Promise<unknown>;
