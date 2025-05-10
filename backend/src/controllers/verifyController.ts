import { getVerifiedStatus } from "@/b/models/verifyModel";

export async function handleGetVerifiedStatus(context: any) {
  const userId = context.params.userId;
  const verified = await getVerifiedStatus(userId);
  return new Response(JSON.stringify({ verified }), {
    headers: { "Content-Type": "application/json" }
  });
}