import { insertVerifyToken, getVerifyToken, deleteVerifyToken, updateVerifiedStatus, getVerifiedStatus, isVerificationExpired } from "@/b/models/VerifyModel";
import { nanoid } from "nanoid";
import { getAndAssertUserId } from "@/b/utils/auth";
// ✅ 認証状態を取得
export async function handleGetVerifiedStatus({ params, env }) {
    const verified = await getVerifiedStatus(params.userId);
    return new Response(JSON.stringify({ verified }), {
        headers: { "Content-Type": "application/json" }
    });
}
// ✅ 認証期限切れかを判定
export async function handleCheckVerificationExpiry(context) {
    const userId = await getAndAssertUserId(context.request, context.env);
    const days = parseInt(new URL(context.request.url).searchParams.get("days") || "30", 10);
    const expired = await isVerificationExpired(userId, days);
    return new Response(JSON.stringify({ expired }), {
        headers: { "Content-Type": "application/json" }
    });
}
// ✅ 認証開始処理（PayPal OAuthへリダイレクト）
export async function startVerification(context) {
    const userId = context.params.userId;
    const url = new URL(context.request.url);
    const email = url.searchParams.get("email");
    if (!userId || !email) {
        return new Response("Missing parameters", { status: 400 });
    }
    const tokenId = nanoid();
    await insertVerifyToken(tokenId, userId, email);
    const redirectUrl = `https://www.paypal.com/oauth2/authorize?...&state=${tokenId}`;
    return Response.redirect(redirectUrl, 302);
}
// ✅ 認証完了処理（PayPalからのコールバック）
export async function completeVerification(context) {
    const tokenId = new URL(context.request.url).searchParams.get("state");
    if (!tokenId)
        return new Response("Invalid state", { status: 400 });
    const tokenRecord = await getVerifyToken(tokenId);
    if (!tokenRecord)
        return new Response("Token expired or invalid", { status: 400 });
    await updateVerifiedStatus(tokenRecord.email);
    await deleteVerifyToken(tokenId);
    return Response.redirect(`/verify/paypal?status=success`);
}
