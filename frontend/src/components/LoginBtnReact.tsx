import React from "react";

const clientId = process.env.PUBLIC_PAYPAL_CLIENT_ID;
const returnUrl = process.env.PUBLIC_REDIRECT_URI;
const scope = "openid profile email";
const locale = "ja_JP";

type PaypalLoginProps = {
  clientId: string;
};

const paypalAuthUrl = [
  "https://www.sandbox.paypal.com/signin/authorize",
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
    >
      PayPalでログイン
    </button>
  </div>
);

export default PaypalLogin;