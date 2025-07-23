import React from "react";
import { messages } from "@/f/config/messageConfig";
import { links } from "@/f/config/links";
import { getLangObj } from "@/f/utils/getLangObj";
const url = getLangObj<typeof links.url>(links.url);
const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const returnUrl = process.env.NEXT_PUBLIC_REDIRECT_URI;
const scope = "openid profile email";
const locale = "ja_JP";

type PaypalLoginProps = {
  lang: string;
  onLoginSuccess?: (user: any) => void;
};

const paypalAuthUrl = [
  process.env.NEXT_PUBLIC_PAYPAL_URL,
  `?client_id=${clientId}`,
  "&response_type=code",
  `&scope=${encodeURIComponent(scope)}`,
  `&redirect_uri=${encodeURIComponent(returnUrl)}`,
  `&locale=${locale}`
].join("");

const PaypalLogin: React.FC<PaypalLoginProps> = ({ lang }) => {
  const handleLogin = () => {
    window.location.href = paypalAuthUrl;
  };
  return (
    <div>
      <button
        style={{ background: "#ffc439", border: "none", borderRadius: "4px", padding: "12px 24px", fontSize: "16px", fontWeight: "bold", color: "#222", cursor: "pointer"}}
        onClick={handleLogin}
      >{messages.login?.[lang]?.loginWithPayPal }</button>
    </div>
  );
};

export default PaypalLogin;