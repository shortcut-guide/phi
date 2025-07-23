import React, { useEffect, useState } from "react";
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

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

const PaypalLogin: React.FC<PaypalLoginProps> = ({ lang, onLoginSuccess }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const jwt = getCookie("token");
      console.log("jwt",jwt);
      if (!jwt) {
        setUser(null);
        return;
      }
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        console.log("auth/me status", res.status);
        if (res.ok) {
          const data = await res.json();
          console.log("auth/me payload", data);
          setUser(data);
          onLoginSuccess && onLoginSuccess(data);
        } else {
          setUser(null);
          console.log("auth/me error", res.status);
        }
      } catch (e) {
        console.error("auth/me fetch error", e);
        window.location.reload();
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    const state = encodeURIComponent(
      JSON.stringify({
        redirectTo: window.location.origin + window.location.pathname + window.location.search,
      })
    );
    const paypalAuthUrl =
      paypalBaseUrl +
      `?client_id=${clientId}` +
      "&response_type=code" +
      `&scope=${encodeURIComponent(scope)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&locale=${locale}` +
      `&state=${state}`;
    window.location.href = paypalAuthUrl;
  };

  const handleLogout = () => {
    fetch("/api/auth/logout", { method: "POST", credentials: "include" }).then(() => {
      setUser(null);
      window.location.reload();
    });
  };

  if (user) {
    return (
      <div>
        <span>
          {user.name
            ? `${user.name} でログイン中`
            : messages.login?.[lang]?.loggedIn}
        </span>
        <button
          style={{
            marginLeft: 8,
            background: "#f0f0f0",
            border: "none",
            borderRadius: "4px",
            padding: "8px 16px",
            fontSize: "14px",
            color: "#333",
            cursor: "pointer"
          }}
          onClick={handleLogout}
        >
          {messages.login?.[lang]?.logout || "ログアウト"}
        </button>
      </div>
    );
  }

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
        {messages.login?.[lang]?.loginWithPayPal || "PayPalでログイン"}
      </button>
    </div>
  );
};

export default PaypalLogin;