import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
  SetDefaultAddressInput,
  AddressCount
} from "@/b/types/address";

export async function getUserAddresses(
  DB: D1Database,
  {user_id}: Pick<Address, "user_id">
): Promise<Address[]> {
  const result = await DB.prepare(`
    SELECT id, name, kana, zip, address, is_default 
    FROM user_addresses 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `).bind(user_id).all<Address>();
  return result.results;
}

export async function countUserAddresses(
  DB: D1Database,
  {user_id}: Pick<Address, "user_id">
): Promise<AddressCount> {
  return await DB.prepare(`
    SELECT COUNT(*) as count FROM user_addresses WHERE user_id = ?
  `).bind(user_id).first<AddressCount>();
}

export async function setDefaultAddress(
  DB: D1Database,
  { user_id, address_id }: SetDefaultAddressInput
) {
  await DB.batch([
    DB.prepare(`UPDATE user_addresses SET is_default = 0 WHERE user_id = ?`).bind(user_id),
    DB.prepare(`UPDATE user_addresses SET is_default = 1 WHERE user_id = ? AND id = ?`).bind(user_id, address_id)
  ]);
}

export async function updateUserAddress(
  DB: D1Database,
  {id, user_id}: Pick<Address, "id" | "user_id">,
  data: UpdateAddressInput
) {
  return await DB.prepare(`
    UPDATE user_addresses 
    SET name = ?, kana = ?, zip = ?, address = ?
    WHERE id = ? AND user_id = ?
  `).bind(data.name, data.kana, data.zip, data.address, id, user_id).run();
}