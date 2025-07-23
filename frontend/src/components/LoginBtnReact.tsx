import React from "react";
import { messages } from "@/f/config/messageConfig";
import { links } from "@/f/config/links";
import { getLangObj } from "@/f/utils/getLangObj";
const url = getLangObj<typeof links.url>(links.url);

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const paypalBaseUrl = process.env.NEXT_PUBLIC_PAYPAL_URL;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
const scope = "openid profile email";
const locale = "ja_JP";

type PaypalLoginProps = {
  lang: string;
  onLoginSuccess?: (user: any) => void;
};

const PaypalLogin: React.FC<PaypalLoginProps> = ({ lang }) => {
  const handleLogin = () => {
    const state = encodeURIComponent(JSON.stringify({
      redirectTo: window.location.pathname + window.location.search
    }));
    const paypalAuthUrl = [
      paypalBaseUrl,
      `?client_id=${clientId}`,
      "&response_type=code",
      `&scope=${encodeURIComponent(scope)}`,
      `&redirect_uri=${encodeURIComponent(redirectUri)}`,
      `&locale=${locale}`,
      `&state=${state}`
    ].join("");
    window.location.href = paypalAuthUrl;
  };
  return (
    <div>
      <button
        style={{
          background: "#ffc439",
          border: "none",
          borderRadius: "4px",
          padding: "12px 24px",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#222",
          cursor: "pointer"
        }}
        onClick={handleLogin}
      >
        {messages.login?.[lang]?.loginWithPayPal}
      </button>
    </div>
  );
};

export default PaypalLogin;