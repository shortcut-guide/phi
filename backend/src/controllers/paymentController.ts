import { isUserVerified } from "@/b/models/userModel";
import { getPaymentMethod, savePaymentMethod } from "@/b/models/paymentModel";


export async function handleGetPayment(req: Request, env: Env): Promise<Response> {
  const userId = "user123";
  const result = await getPaymentMethod(env.DB, userId);
  return new Response(JSON.stringify(result || { selectedMethod: null }), { status: 200 });
}

export async function handleSetPayment(req: Request, env: Env): Promise<Response> {
  const userId = "user123";
  const { method } = await req.json();

  // 本人確認チェック
  const verified = await isUserVerified(env.DB, userId);
  if (!verified) {
    return new Response("本人確認が必要です", { status: 403 });
  }

  await savePaymentMethod(env.DB, userId, method);
  return new Response(null, { status: 204 });
}