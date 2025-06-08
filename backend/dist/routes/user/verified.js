import { isUserVerified } from "@/b/models/userModel";
export default {
    async fetch(request, env) {
        // クエリパラメータから userId を取得
        // /api/user/verified?userId=xxxx
        const url = new URL(request.url);
        const userId = url.searchParams.get("userId");
        if (!userId) {
            return new Response(JSON.stringify({ error: "userId is required" }), { status: 400 });
        }
        const verified = await isUserVerified(env.CLOUDFLARE_D1_DATABASE_PROFILE, userId);
        return new Response(JSON.stringify({ isVerified: verified }), { status: 200 });
    }
};
