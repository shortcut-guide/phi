export async function executeQuery<T = Record<string, unknown>>(
  db: D1Database, // データベースインスタンスを引数として受け取る
  query: string,
  bindings: any[] = [],
  isSelect = false
): Promise<T[] | D1Result> {
  const stmt = db.prepare(query).bind(...bindings);
  if (isSelect) {
    const result = await stmt.all();
    return result.results as T[];
  } else {
    return await stmt.run();
  }
}