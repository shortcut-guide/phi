import { Product } from "@/b/types/product";
import { getD1Product } from "@/b/utils/d1";

export async function getProducts(){
  const db = getD1Product();
  const result = await db.prepare("SELECT * FROM products").all();
  return result.results;
};

export async function createProduct(product: Product){
  const db = getD1Product();
  const result = await db.prepare(`
    INSERT INTO products (id, name, shop_name, platform, base_price, ec_data)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  .bind(product.id, product.name, product.shop_name, product.platform, product.base_price, product.ec_data)
  .run();
  return result.results;
};

export async function updateProduct(product: Product){
    const db = getD1Product();
    const result = await db.prepare(`
      UPDATE products SET
        name = ?, shop_name = ?, platform = ?, base_price = ?, ec_data = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    .bind(product.name, product.shop_name, product.platform, product.base_price, product.ec_data, product.id)
    .run();
    return result.results;
};

export async function deleteProduct(id: string){
  const db = getD1Product();
  const result = await db.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
  return result.results;
};

export async function getFilteredProducts({ shop, limit, ownOnly }: { shop?: string; limit: number; ownOnly: boolean; }){
  const db = getD1Product();

  let query = 'SELECT * FROM products';
  const conditions: string[] = [];
  const bindings: any[] = [];

  if (ownOnly) {
    conditions.push('shop_name = ?');
    bindings.push('自社');
  }

  if (shop) {
    conditions.push('site_name = ?');
    bindings.push(shop);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY updated_at DESC LIMIT ?';
  bindings.push(limit);

  const result = await db.prepare(query).bind(...bindings).all();
  return result.results;
}