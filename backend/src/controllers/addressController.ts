import { fetchAddresses, countAddresses, insertAddress } from "@/b/models/addressModel";
import type { Env } from "@/b/types/env";
import type { CreateAddressInput } from "@/b/types/address";
import { getAndAssertUserId } from "@/b/utils/auth";

export async function GetAddresses(req: Request, env: Env): Promise<Response> {
  const user_id = await getAndAssertUserId(req, env);
  const addresses = await fetchAddresses(user_id);
  return new Response(JSON.stringify(addresses), { status: 200 });
}

export async function CreateAddress(req: Request, env: Env): Promise<Response> {
  const user_id = await getAndAssertUserId(req, env);
  const countResult = await countAddresses(user_id);
  if (countResult.count >= 3) {
    return new Response("住所の登録は3件までです", { status: 403 });
  }

  const { name, kana, zip, address }: Omit<CreateAddressInput, "user_id"> = await req.json();
  await insertAddress({ user_id, name, kana, zip, address });

  return new Response(null, { status: 201 });
}
