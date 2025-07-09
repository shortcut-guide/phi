import React from "react";
import { messages } from "@/f/config/messageConfig";
import { links } from "@/f/config/links";
import { getLangObj } from "@/f/utils/getLangObj";
const url = getLangObj<typeof links.url>(links.url);
const clientId = process.env.PUBLIC_PAYPAL_CLIENT_ID;
const returnUrl = process.env.PUBLIC_REDIRECT_URI;
const scope = "openid profile email";
const locale = "ja_JP";

type PaypalLoginProps = {
  clientId: string;
};

const paypalAuthUrl = [
  url.paypal.sandbox,
  `?client_id=${clientId}`,
  "&response_type=code",
  `&scope=${encodeURIComponent(scope)}`,
  `&redirect_uri=${encodeURIComponent(returnUrl)}`,
  `&locale=${locale}`
].join("");

const PaypalLogin: React.FC<PaypalLoginProps> = ({ clientId }) => (
  <div>
    <button
      style={{ background: "#ffc439", border: "none", borderRadius: "4px", padding: "12px 24px", fontSize: "16px", fontWeight: "bold", color: "#222", cursor: "pointer"}}
      onClick={() => window.location.href = paypalAuthUrl}
    >PayPal Login</button>
  </div>
);

export default PaypalLogin;