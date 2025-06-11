export declare const insertSearchLog: (keyword: string, user_id: string | null) => Promise<void>;
export declare const insertClickLog: (keyword: string, user_id: string, product_id: string) => Promise<void>;
export declare const getPopularKeywords: () => Promise<Record<string, unknown>[]>;
