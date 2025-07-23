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
      id: userInfo.user_id,
      name: userInfo.name,
      payer_id: userInfo.payer_id,
      address:{
        street_address: userInfo.address.street_address,
        locality: userInfo.address.locality,
        region: userInfo.address.region,
        postal_code: userInfo.address.postal_code,
        contry: userInfo.address.contry
      },
      verified_account: userInfo.verified_account,
      emails:userInfo.emails.value,
      card_change_url: PAYPAL_CARDS_URL,
      address_change_url: PAYPAL_ADDRESS_URL,
    },
    jwt,
  };
};