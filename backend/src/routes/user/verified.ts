import { isUserVerified } from "@/b/models/userModel";

export const onRequestGet = async ({ env }: { env: Env }) => {
  const userId = "user123";
  const verified = await isUserVerified(env.DB, userId);
  return new Response(JSON.stringify({ isVerified: verified }), { status: 200 });
};
