export async function executeQuery<T = Record<string, unknown>>(
  db: D1Database, // データベースインスタンスを引数として受け取る
  query: string,
  bindings: any[] = [],
  isSelect = false
): Promise<T[] | D1Result> {
  const stmt = db.prepare(query).bind(...bindings);
  if (!isSelect) return await stmt.run();

  const result = await stmt.all();
  return [...result.results] as T[];
}

// 選択系（SELECT）専用：返り値は T[]
export async function selectQuery<T = Record<string, unknown>>(
  db: D1Database,
  query: string,
  bindings: any[] = []
): Promise<T[]> {
  const stmt = db.prepare(query).bind(...bindings);
  const result = await stmt.all();
  return [...result.results] as T[];
}