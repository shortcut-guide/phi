/// <reference types="@cloudflare/workers-types" />
import * as jwt from "@tsndr/cloudflare-worker-jwt";
import key from "@/b/config/phi-455615-e98413c6f246.json";
interface GoogleServiceAccount {
  private_key: string;
  client_email: string;
  token_uri: string;
}

interface DriveToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export const getDriveToken = async (kv: KVNamespace): Promise<DriveToken> => {
  const tokenKey = "drive:access_token";

  // キャッシュからトークンを取得
  const cached = await kv.get(tokenKey, { type: "json" }) as DriveToken | null;
  if (cached) return cached;

  const key = JSON.parse(
    await kv.get("drive:service_account", { type: "text" }) || ""
  ) as GoogleServiceAccount;

  const now = Math.floor(Date.now() / 1000);
  const ttl = 3600;

  const scope = "https://www.googleapis.com/auth/drive.readonly";

  const jwtToken = await jwt.sign(
    {
      iss: key.client_email,
      scope,
      aud: key.token_uri,
      iat: now,
      exp: now + ttl,
    },
    key.private_key,
    {
      algorithm: "RS256",
      header: { typ: "JWT" },
    }
  );

  const form = new URLSearchParams();
  form.set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  form.set("assertion", jwtToken);

  const tokenRes = await fetch(key.token_uri, {
    method: "POST",
    body: form,
  });

  if (!tokenRes.ok) throw new Error("Failed to fetch Google Drive token");

  const token = await tokenRes.json() as DriveToken;

  // キャッシュ保存
  await kv.put(tokenKey, JSON.stringify(token), { expirationTtl: ttl });

  return token;
};

export const getDriveFile = async (id: string, kv: KVNamespace): Promise<ArrayBuffer> => {
  const token = await getDriveToken(kv);
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch file from Drive: ${response.statusText}`);
  }

  return await response.arrayBuffer();
};