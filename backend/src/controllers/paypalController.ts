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

// Express用：純粋なデータを返す
export const handlePaypalCallback = async (code: string) => {
  const token = await exchangeCodeForToken(code) as PaypalTokenResponse;
  const userInfo = await getPaypalUserInfo(token.access_token) as PaypalUserInfo;
  const jwt = await generateJWT({ email: userInfo.email });

  // PayPalアカウントのクレカ・住所変更ページ
  const PAYPAL_CARDS_URL = "https://www.paypal.com/myaccount/money/cards";
  const PAYPAL_ADDRESS_URL = "https://www.paypal.com/myaccount/settings/address";

  return {
    success: true,
    user: {
      email: userInfo.email,
      name: userInfo.name || `${userInfo.given_name ?? ""} ${userInfo.family_name ?? ""}`.trim(),
      card_name: null,
      card_change_url: PAYPAL_CARDS_URL,
      address_change_url: PAYPAL_ADDRESS_URL,
    },
    jwt,
  };
};