import type { Env } from "@/b/types/env";
import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
  SetDefaultAddressInput,
  AddressCount
} from "@/b/types/address";
import { getD1UserProfile } from "@/b/utils/d1";

async function executeQuery<T = Record<string, unknown>>(query: string, bindings: any[] = [], isSelect = false): Promise<T[]> {
  const db = getD1UserProfile();
  const stmt = db.prepare(query).bind(...bindings);
  const result = isSelect ? await stmt.all() : await stmt.run();
  return isSelect ? ((result.results ?? []) as T[]) : ([] as T[]);
}

export async function fetchAddresses(
  user_id: string
): Promise<Address[]> {
  const query = `
    SELECT id, name, kana, zip, address, is_default 
    FROM user_addresses 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `;
  const rows = await executeQuery<Address>(query, [user_id], true);
  return rows;
}

export async function countAddresses(
  user_id: string
): Promise<AddressCount> {
  const query = `
    SELECT COUNT(*) as count 
    FROM user_addresses 
    WHERE user_id = ?
  `;
  const result = await executeQuery(query, [user_id], true);
  if (!result || result.length === 0) {
    throw new Error("Failed to count user addresses");
  }
  return { count: Number(result[0].count) };
}

export async function setDefaultAddress(
  user_id: string,
  address_id: string
): Promise<void> {
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
    await executeQuery(query, bindings);
  }
}

export async function updateAddress(
  id: string,
  user_id: string,
  data: UpdateAddressInput
): Promise<void> {
  const query = `
    UPDATE user_addresses 
    SET name = ?, kana = ?, zip = ?, address = ?
    WHERE id = ? AND user_id = ?
  `;
  const bindings = [data.name, data.kana, data.zip, data.address, id, user_id];
  await executeQuery(query, bindings);
}

export async function insertAddress(
  data: CreateAddressInput
): Promise<void> {
  const query = `
    INSERT INTO user_addresses (id, user_id, name, kana, zip, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const bindings = [
    crypto.randomUUID(),
    data.user_id,
    data.name,
    data.kana,
    data.zip,
    data.address,
  ];
  await executeQuery(query, bindings);
}