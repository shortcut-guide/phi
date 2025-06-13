
import { fetchAddresses, countAddresses, insertAddress } from "@/b/models/addressModel";
import { getAndAssertUserId } from "@/b/utils/auth";

import type { Env } from "@/b/types/env";
import type { CreateAddressInput } from "@/b/types/address";

export async function GetAddresses(req: Request, env: Env): Promise<Response> {
  const user_id = await getAndAssertUserId(req, env);
  const addresses = await fetchAddresses(env.PROFILE_DB, user_id); // env.DB を渡す形に変更
  return new Response(JSON.stringify(addresses), { status: 200 });
}

export async function CreateAddress(req: Request, env: Env): Promise<Response> {
  const user_id = await getAndAssertUserId(req, env);
  const countResult = await countAddresses(env.PROFILE_DB, user_id); // env.DB を渡す形に変更
  if (countResult.count >= 3) {
    return new Response("住所の登録は3件までです", { status: 403 });
  }

  const { name, kana, zip, address }: Omit<CreateAddressInput, "user_id"> = await req.json();
  const id = crypto.randomUUID();
  const is_default = 0;
  const created_at = new Date().toISOString();
  await insertAddress(env.PROFILE_DB, { id, user_id, name, kana, zip, address, is_default, created_at });

  return new Response(null, { status: 201 });
}
