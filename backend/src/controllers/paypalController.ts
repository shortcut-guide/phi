import { Request, Response } from "express";
import { exchangeCodeForToken, getPaypalUserInfo } from "@/b/services/paypal";
import { generateJWT } from "@/b/utils/jwt";
import { links } from "@/b/config/links";

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
  const jwtToken = await generateJWT(userInfo);
  const url = links.url;

  return {
    success: true,
    jwt: jwtToken,
    user: userInfo,
    paypal_url:{
      card: url.paypalCard,
      address: url.paypalAddress
    }
  };
};

// CSRFトークン発行API（cookie方式）
export const getCSRFToken = (req: Request, res: Response) => {
  // ルートでcsrfProtectionミドルウェアを利用していれば、req.csrfToken()が有効
  const token = req.csrfToken();
  res.json({ token });
};