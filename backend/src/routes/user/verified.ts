import type { D1Database } from "@cloudflare/workers-types";
import { isUserVerified } from "@/b/models/userModel";
import type { UserProfile } from "@/b/types/userProfile";

type Env = {
  CLOUDFLARE_D1_DATABASE_PROFILE: D1Database;
};

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), { status: 400 });
    }

    // UserProfile 型を作成して渡す
    const userProfile: UserProfile = { user_id: userId };
    const verified = await isUserVerified(env.CLOUDFLARE_D1_DATABASE_PROFILE, userProfile);

    return new Response(JSON.stringify({ isVerified: verified }), { status: 200 });
  }
};