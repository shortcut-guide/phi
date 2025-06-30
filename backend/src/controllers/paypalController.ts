import { exchangeCodeForToken, getPaypalUserInfo } from "@/b/services/paypal";
import { generateJWT } from "@/b/utils/jwt";
export const handlePaypalCallback = async (req: Request): Promise<Response> => {
  const { code } = await req.json();

  const token = await exchangeCodeForToken(code);
  const userInfo = await getPaypalUserInfo(token.access_token);

  const jwt = await generateJWT(userInfo.email);
  const headers = new Headers({ "Set-Cookie": `token=${jwt}; HttpOnly; Path=/;` });

  return new Response(JSON.stringify({ success: true }), { headers });
};