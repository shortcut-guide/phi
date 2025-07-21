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

  // PayPalアカウントのクレカ・住所変更ページ（ユーザーが手動でアクセスするためのURL）
  const PAYPAL_CARDS_URL = "https://www.paypal.com/myaccount/money/cards";
  const PAYPAL_ADDRESS_URL = "https://www.paypal.com/myaccount/settings/address";

  const headers = new Headers({ "Set-Cookie": `token=${jwt}; HttpOnly; Path=/;` });
  const response = {
    success: true,
    user: {
      email: userInfo.email,
      name: userInfo.name || `${userInfo.given_name ?? ""} ${userInfo.family_name ?? ""}`.trim(),
      // クレカ名は取得不可（PayPal API制約）
      card_name: null,
      card_change_url: PAYPAL_CARDS_URL,
      address_change_url: PAYPAL_ADDRESS_URL,
    },
    jwt,
  };

  return new Response(JSON.stringify(response), { headers });
};