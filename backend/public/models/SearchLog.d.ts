export declare const insertSearchLog: (keyword: string, user_id: string | null) => Promise<Record<string, unknown>[]>;
export declare const insertClickLog: (keyword: string, user_id: string, product_id: string) => Promise<Record<string, unknown>[]>;
export declare const getPopularKeywords: () => Promise<Record<string, unknown>[]>;
export declare const findSuggestedKeywords: (prefix: string) => Promise<string[]>;
