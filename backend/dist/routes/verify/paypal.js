import { paypalOAuthHandler } from "@/b/auth/paypal";
export const onRequestGet = async (context) => {
    return paypalOAuthHandler(context);
};
