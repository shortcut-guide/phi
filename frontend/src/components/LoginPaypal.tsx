"use client";

import React from "react";
import PaypalLoginButton from "@/f/components/auth/paypal/PaypalLoginButton";

type Props = {
  lang?: string;
  className?: string;
  label?: string;
  successPath?: string;
  cancelPath?: string;
  authPath?: string;
  clientId?: string;
};

export default function LoginPaypal(props: Props) {
  return (
    <PaypalLoginButton
      lang={props.lang}
      className={props.className}
      label={props.label}
      successPath={props.successPath}
      cancelPath={props.cancelPath}
      authPath={props.authPath}
      clientId={props.clientId}
    />
  );
}