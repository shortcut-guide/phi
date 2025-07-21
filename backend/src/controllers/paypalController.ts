import { exchangeCodeForToken, getPaypalUserInfo } from "@/b/services/paypal";
import { generateJWT } from "@/b/utils/jwt";

type PaypalTokenResponse = {
  access_token: string;
  expires_in?: number;
  token_type?: string;
  refresh_token?: string;
  [key: string]: any;
};

type PaypalUserInfo = {
  email: string;
  [key: string]: any;
};

export const handlePaypalCallback = async ({ code }: { code: string }): Promise<Response> => {
  const token = await exchangeCodeForToken(code) as PaypalTokenResponse;
  const userInfo = await getPaypalUserInfo(token.access_token) as PaypalUserInfo;

  const jwt = await generateJWT({ email: userInfo.email });
  const headers = new Headers({ "Set-Cookie": `token=${jwt}; HttpOnly; Path=/;` });

  return new Response(JSON.stringify({ success: true }), { headers });
};