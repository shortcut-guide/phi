import { executeQuery } from "@/b/utils/executeQuery";
import type { Address, AddressCount } from "@/b/types/address";

export async function fetchAddresses(db: D1Database, user_id: string): Promise<Address[]> {
  const query = `
    SELECT id, name, kana, zip, address, is_default 
    FROM user_addresses 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `;
  const result = await executeQuery<Address>(db, query, [user_id], true);
  if (!Array.isArray(result)) {
    throw new Error("Failed to fetch addresses");
  }
  return result;
}

export async function countAddresses(db: D1Database, user_id: string): Promise<AddressCount> {
  const query = `
    SELECT COUNT(*) as count 
    FROM user_addresses 
    WHERE user_id = ?
  `;
  const rows = await executeQuery<{ count: number }>(db, query, [user_id], true);
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("Failed to count user addresses");
  }
  return { count: rows[0].count };
}

export async function setDefaultAddress(db: D1Database, user_id: string, address_id: string): Promise<void> {
  const queries = [
    {
      query: `UPDATE user_addresses SET is_default = 0 WHERE user_id = ?`,
      bindings: [user_id],
    },
    {
      query: `UPDATE user_addresses SET is_default = 1 WHERE user_id = ? AND id = ?`,
      bindings: [user_id, address_id],
    },
  ];
  for (const { query, bindings } of queries) {
    await executeQuery(db, query, bindings);
  }
}

export async function insertAddress(db: D1Database, address: Address): Promise<void> {
  const query = `
    INSERT INTO user_addresses (id, user_id, name, kana, zip, address, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const bindings = [
    address.id,
    address.user_id,
    address.name,
    address.kana,
    address.zip,
    address.address,
    address.is_default,
  ];
  await executeQuery(db, query, bindings);
}