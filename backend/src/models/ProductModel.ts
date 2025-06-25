import { getD1Product } from "@/b/utils/d1";
import { executeQuery } from "@/b/utils/executeQuery";
import { Product } from "@/b/types/product";

export async function getProducts() {
  const db = getD1Product();
  return await executeQuery<Product>(db, "SELECT * FROM products", [], true);
}

export async function createProduct(product: Product) {
  const db = getD1Product();
  const query = `
    INSERT INTO products (id, name, shop_name, platform, base_price, ec_data)
    VALUES (?, ?, ?, ?, ?, ?)`;
  const bindings = [
    product.id,
    product.name,
    product.shop_name,
    product.platform,
    product.base_price,
    product.ec_data,
  ];
  return await executeQuery(db, query, bindings);
}

export async function updateProduct(product: Product) {
  const db = getD1Product();
  const query = `
    UPDATE products SET
      name = ?, shop_name = ?, platform = ?, base_price = ?, ec_data = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`;
  const bindings = [
    product.name,
    product.shop_name,
    product.platform,
    product.base_price,
    product.ec_data,
    product.id,
  ];
  return await executeQuery(db, query, bindings);
}

export async function deleteProduct(id: string) {
  const db = getD1Product();
  const query = "DELETE FROM products WHERE id = ?";
  return await executeQuery(db, query, [id]);
}

export async function getFilteredProducts(
  {
    shop,
    limit,
  }: {
    shop?: string;
    limit: number;
  }
) {

  const db = getD1Product();
  let query = "SELECT * FROM products";
  const conditions: string[] = [];
  const bindings: any[] = [];

  if (shop) {
    conditions.push("site_name = ?");
    bindings.push(shop);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  query += " ORDER BY updated_at DESC LIMIT ?";
  bindings.push(limit);

  return await executeQuery<Product>(db, query, bindings, true);
}

export async function upsertProduct(product: Product) {
  const db = getD1Product();
  const query = `
    INSERT INTO products (id, name, shop_name, platform, base_price, ec_data)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      shop_name = excluded.shop_name,
      platform = excluded.platform,
      base_price = excluded.base_price,
      ec_data = excluded.ec_data,
      updated_at = CURRENT_TIMESTAMP
  `;
  const bindings = [
    product.id,
    product.name,
    product.shop_name,
    product.platform,
    product.base_price,
    product.ec_data,
  ];
  return await executeQuery(db, query, bindings);
}
