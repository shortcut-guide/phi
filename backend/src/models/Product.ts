import { Product } from "@/b/types/product";

export const getProducts = async (db: D1Database): Promise<Product[]> => {
  const { results } = await db.prepare("SELECT * FROM products").all();
  return results as Product[];
};

export const createProduct = async (db: D1Database, product: Product) => {
  return await db
    .prepare(`
      INSERT INTO products (id, name, shop_name, platform, base_price, ec_data)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .bind(product.id, product.name, product.shop_name, product.platform, product.base_price, product.ec_data)
    .run();
};

export const updateProduct = async (db: D1Database, product: Product) => {
  return await db
    .prepare(`
      UPDATE products SET
        name = ?, shop_name = ?, platform = ?, base_price = ?, ec_data = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    .bind(product.name, product.shop_name, product.platform, product.base_price, product.ec_data, product.id)
    .run();
};

export const deleteProduct = async (db: D1Database, id: string) => {
  return await db.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
};