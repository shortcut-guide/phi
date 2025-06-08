export declare const getToken: (db: D1Database) => Promise<Record<string, unknown> | null>;
export declare const saveToken: (db: D1Database, token: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}) => Promise<void>;
export declare const updateToken: (db: D1Database, token: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}) => Promise<void>;
export declare const deleteToken: (db: D1Database) => Promise<void>;
