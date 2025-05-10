import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
  SetDefaultAddressInput,
  AddressCount
} from "@/b/types/address";

export async function getUserAddresses(DB: D1Database, userId: string): Promise<Address[]> {
  const result = await DB.prepare(`
    SELECT id, name, kana, zip, address, is_default 
    FROM user_addresses 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `).bind(userId).all<Address>();
  return result.results;
}

export async function countUserAddresses(DB: D1Database, userId: string): Promise<AddressCount> {
  return await DB.prepare(`
    SELECT COUNT(*) as count FROM user_addresses WHERE user_id = ?
  `).bind(userId).first<AddressCount>();
}

export async function setDefaultAddress(DB: D1Database, { user_id, address_id }: SetDefaultAddressInput) {
  await DB.batch([
    DB.prepare(`UPDATE user_addresses SET is_default = 0 WHERE user_id = ?`).bind(user_id),
    DB.prepare(`UPDATE user_addresses SET is_default = 1 WHERE user_id = ? AND id = ?`).bind(user_id, address_id)
  ]);
}
