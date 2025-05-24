// backend/models/pinModel.ts
import { getD1Product } from "@/b/utils/d1";

export async function getPins(offset = 0, limit = 30) {
  const DB = getD1Product();
  const stmt = DB.prepare(`
    SELECT
      id,
      json_extract(ec_data, '$.image_url') AS imageUrl,
      name AS title
    FROM products
    ORDER BY updated_at DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset);

  const result = await stmt.all();
  return result.results as { 
    id: string; 
    imageUrl: string; 
    title: string
  }[];
}