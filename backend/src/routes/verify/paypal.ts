import { paypalOAuthHandler } from "@/b/auth/paypal";

export const onRequestGet = async (context: any) => {
  return paypalOAuthHandler(context);
};
