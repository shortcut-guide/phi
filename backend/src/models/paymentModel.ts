import type { PaymentMethod, SavePaymentMethodInput } from "@/b/types/payment";

export async function getPaymentMethod(DB: D1Database, user_id: Pick<PaymentMethod, "user_id">): Promise<PaymentMethod | null> {
  const result = await DB.prepare(
    `SELECT user_id, method, updated_at FROM payment_methods WHERE user_id = ?`
  ).bind(user_id).first<PaymentMethod>();
  return result ?? null;
}

export async function savePaymentMethod(DB: D1Database, { user_id, method }: SavePaymentMethodInput) {
  return await DB.prepare(`
    INSERT INTO payment_methods (user_id, method, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET method = excluded.method, updated_at = CURRENT_TIMESTAMP
  `).bind(user_id, method).run();
}