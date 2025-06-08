import { getD1Product } from "@/b/utils/d1";
export async function getPins(offset = 0, limit = 30) {
    const db = getD1Product();
    const stmt = await db.prepare(`
    SELECT
      p.id,
      json_extract(p.ec_data, '$.image_url') AS imageUrl,
      p.name AS title,
      json_extract(p.ec_data, '$.price_diff') AS priceDiff,              -- 価格差
      json_extract(p.ec_data, '$.auto_discount') AS autoDiscount,        -- 自動値下げフラグ
      json_extract(p.ec_data, '$.cart_count') AS cartCount,              -- カート追加数
      json_extract(p.ec_data, '$.sales_count') AS salesCount,            -- 売上件数
      json_extract(p.ec_data, '$.priority') AS userPriority,             -- ユーザー設定優先度
      json_extract(p.ec_data, '$.category_priority') AS categoryPriority -- カテゴリ優先度
    FROM products p
    WHERE
      (
        json_extract(p.ec_data, '$.price_diff') IS NOT NULL AND json_extract(p.ec_data, '$.price_diff') != 0
        OR json_extract(p.ec_data, '$.auto_discount') = 1
        OR json_extract(p.ec_data, '$.cart_count') >= 5
        OR json_extract(p.ec_data, '$.sales_count') >= 10
        OR json_extract(p.ec_data, '$.priority') = 1
        OR json_extract(p.ec_data, '$.category_priority') = 1
      )
    ORDER BY
      json_extract(p.ec_data, '$.priority') DESC,
      json_extract(p.ec_data, '$.category_priority') DESC,
      json_extract(p.ec_data, '$.cart_count') DESC,
      json_extract(p.ec_data, '$.sales_count') DESC,
      p.updated_at DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset).all();
    return stmt.results;
}
