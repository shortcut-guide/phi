import type { Env } from "@/b/types/env";
import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
  SetDefaultAddressInput,
  AddressCount
} from "@/b/types/address";
import { getDB } from "@/b/utils/d1";

export async function getUserAddresses(
  env: Env,
  {user_id}: Pick<Address, "user_id">
): Promise<Address[]> {
  const DB = getDB(env);
  const result = await DB.prepare(`
    SELECT id, name, kana, zip, address, is_default 
    FROM user_addresses 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `).bind(user_id).all();
  return result.results as Address[];
}

export async function countUserAddresses(
  env: Env,
  {user_id}: Pick<Address, "user_id">
): Promise<AddressCount> {
  const DB = getDB(env);
  const result = await DB.prepare(`
    SELECT COUNT(*) as count FROM user_addresses WHERE user_id = ?
  `).bind(user_id).first();
  if (!result) {
    throw new Error("Failed to count user addresses");
  }
  return result;
}

export async function setDefaultAddress(
  env: Env,
  { user_id, address_id }: SetDefaultAddressInput
) {
  const DB = getDB(env);
  return await DB.batch([
    DB.prepare(`UPDATE user_addresses SET is_default = 0 WHERE user_id = ?`).bind(user_id),
    DB.prepare(`UPDATE user_addresses SET is_default = 1 WHERE user_id = ? AND id = ?`).bind(user_id, address_id)
  ]);
}

export async function updateUserAddress(
  env: Env,
  {id, user_id}: Pick<Address, "id" | "user_id">,
  data: UpdateAddressInput
) {
  const DB = getDB(env);
  return await DB.prepare(`
    UPDATE user_addresses 
    SET name = ?, kana = ?, zip = ?, address = ?
    WHERE id = ? AND user_id = ?
  `).bind(data.name, data.kana, data.zip, data.address, id, user_id).run();
}

export async function insertUserAddress(
  env: Env,
  { user_id, name, kana, zip, address }: CreateAddressInput
) {
  const DB = getDB(env);
  const id = crypto.randomUUID();
  return await DB.prepare(`
    INSERT INTO user_addresses (id, user_id, name, kana, zip, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(id, user_id, name, kana, zip, address).run();
}