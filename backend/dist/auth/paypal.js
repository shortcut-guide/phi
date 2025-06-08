import { getAccessTokenFromCode, getUserInfoFromToken } from "@/b/services/oauthService";
import { markUserAsVerified } from "@/b/models/VerifyModel";
export const paypalOAuthHandler = async (context) => {
    const code = new URL(context.request.url).searchParams.get("code");
    if (!code)
        return new Response("Missing code", { status: 400 });
    try {
        const token = await getAccessTokenFromCode(code);
        const userInfo = await getUserInfoFromToken(token);
        await markUserAsVerified(userInfo.email);
        return Response.redirect("/verify/paypal?status=success");
    }
    catch (err) {
        console.error("PayPal OAuth error:", err);
        return Response.redirect("/verify/paypal?status=failure");
    }
};
