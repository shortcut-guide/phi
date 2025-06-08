import { getDB } from "@/b/utils/d1";
export async function getUserAddresses(env, { user_id }) {
    const DB = getDB(env);
    const result = await DB.prepare(`
    SELECT id, name, kana, zip, address, is_default 
    FROM user_addresses 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `).bind(user_id).all();
    return result.results;
}
export async function countUserAddresses(env, { user_id }) {
    const DB = getDB(env);
    const result = await DB.prepare(`
    SELECT COUNT(*) as count FROM user_addresses WHERE user_id = ?
  `).bind(user_id).first();
    if (!result) {
        throw new Error("Failed to count user addresses");
    }
    return result;
}
export async function setDefaultAddress(env, { user_id, address_id }) {
    const DB = getDB(env);
    return await DB.batch([
        DB.prepare(`UPDATE user_addresses SET is_default = 0 WHERE user_id = ?`).bind(user_id),
        DB.prepare(`UPDATE user_addresses SET is_default = 1 WHERE user_id = ? AND id = ?`).bind(user_id, address_id)
    ]);
}
export async function updateUserAddress(env, { id, user_id }, data) {
    const DB = getDB(env);
    return await DB.prepare(`
    UPDATE user_addresses 
    SET name = ?, kana = ?, zip = ?, address = ?
    WHERE id = ? AND user_id = ?
  `).bind(data.name, data.kana, data.zip, data.address, id, user_id).run();
}
export async function insertUserAddress(env, { user_id, name, kana, zip, address }) {
    const DB = getDB(env);
    const id = crypto.randomUUID();
    return await DB.prepare(`
    INSERT INTO user_addresses (id, user_id, name, kana, zip, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(id, user_id, name, kana, zip, address).run();
}
