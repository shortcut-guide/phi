import { countUserAddresses } from "@/b/models/addressModel";
import type { CreateAddressInput } from "@/b/types/address";

export async function handleCreateAddress(req: Request, env: Env): Promise<Response> {
  const userId = "user123";

  const countResult = await countUserAddresses(env.DB, userId);
  if (countResult?.count >= 3) {
    return new Response("住所の登録は3件までです", { status: 403 });
  }

  const { name, kana, zip, address }: CreateAddressInput = await req.json();
  const id = crypto.randomUUID();

  await env.DB.prepare(`
    INSERT INTO user_addresses (id, user_id, name, kana, zip, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(id, userId, name, kana, zip, address).run();

  return new Response(null, { status: 201 });
}
