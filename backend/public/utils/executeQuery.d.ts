export declare function executeQuery<T = Record<string, unknown>>(db: D1Database, // データベースインスタンスを引数として受け取る
query: string, bindings?: any[], isSelect?: boolean): Promise<T[] | D1Result>;
export declare function selectQuery<T = Record<string, unknown>>(db: D1Database, query: string, bindings?: any[]): Promise<T[]>;
