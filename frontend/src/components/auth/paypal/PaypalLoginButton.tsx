"use client";

import React from "react";
import { usePaypalLogin } from "@/f/hooks/usePaypalLogin";
import { messages } from "@/f/config/messageConfig";
import type { PaypalLoginOptions } from "@/f/types/auth";

type Props = {
  lang?: string;
  label?: string;
  className?: string;
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (err: unknown) => void;
} & Partial<PaypalLoginOptions>;

export default function PaypalLoginButton(props: Props) {
  const {
    lang,
    label,
    className,
    onStart,
    onComplete,
    onError,
    successPath,
    cancelPath,
    authPath,
    clientId,
    scope,
    stateExtra,
    source,
  } = props;

  const { login, getStatus } = usePaypalLogin({
    lang,
    successPath,
    cancelPath,
    authPath,
    clientId,
    scope,
    stateExtra,
    source: source || "login_button",
  });

  const [disabled, setDisabled] = React.useState(false);
  const status = getStatus();

  React.useEffect(() => {
    setDisabled(status === "redirecting" || status === "building");
  }, [status]);

  const click = async () => {
    try {
      onStart?.();
      await login();
      onComplete?.();
    } catch (e) {
      onError?.(e);
      setDisabled(false);
    }
  };

  const text = label || (lang?.startsWith("ja") ? "PayPalでログイン" : "Sign in with PayPal");

  return (
    <button
      type="button"
      onClick={click}
      disabled={disabled}
      aria-disabled={disabled}
      className={
        className ||
        "inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
      }
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        className={disabled ? "animate-spin mr-2" : "mr-2"}
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
      {text}
    </button>
  );
}