import { countUserAddresses, getUserAddresses, insertUserAddress } from "@/b/models/addressModel";
import { getAndAssertUserId } from "@/b/utils/auth";
export async function GetAddresses(req, env) {
    const user_id = (await getAndAssertUserId(req, env));
    const result = await getUserAddresses(env.DB, { user_id: user_id });
    return new Response(JSON.stringify(result), { status: 200 });
}
export async function CreateAddress(req, env) {
    const user_id = (await getAndAssertUserId(req, env));
    const countResult = await countUserAddresses(env.DB, { user_id: user_id });
    if (countResult?.count >= 3) {
        return new Response("住所の登録は3件までです", { status: 403 });
    }
    const { name, kana, zip, address } = await req.json();
    await insertUserAddress(env.DB, { user_id, name, kana, zip, address });
    return new Response(null, { status: 201 });
}
