// backend/src/controllers/amazonController.ts
import { Request, Response } from "express";
import fetch from "node-fetch";
import cloudflareJwt from "@tsndr/cloudflare-worker-jwt";

const CLIENT_ID = process.env.AMAZON_CLIENT_ID!;
const CLIENT_SECRET = process.env.AMAZON_CLIENT_SECRET!;
const REDIRECT_URI = process.env.AMAZON_REDIRECT_URI!;

export async function amazonAuth(_: Request, res: Response) {
  const url = `https://www.amazon.com/ap/oa?client_id=${CLIENT_ID}&scope=profile&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  res.redirect(url);
}

export async function amazonCallback(req: Request, res: Response) {
  const { code } = req.query;
  if (!code) return res.status(400).send("No code");

  // 1. トークン取得
  const tokenRes = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code as string,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const tokenJson = await tokenRes.json();
  const access_token = tokenJson.access_token;
  if (!access_token) return res.status(401).send("Token error");

  // 2. プロフィール取得
  const profileRes = await fetch("https://api.amazon.com/user/profile", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const profile = await profileRes.json();

  // 3. JWT発行
  const token = await cloudflareJwt.sign(
    { sub: profile.user_id, email: profile.email },
    process.env.JWT_SECRET!
  );

  res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "lax" });
  res.redirect("/");
}