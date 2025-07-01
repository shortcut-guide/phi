/// <reference types="astro/client" />
import { PayPalButtons, PayPalScriptProvider, type ReactPayPalScriptOptions } from '@paypal/react-paypal-js';

interface LoginBtnReactProps {
  clientId: string;
}
export default function LoginBtnReact({ clientId }:LoginBtnReactProps) {
  const initialOptions: ReactPayPalScriptOptions = {
    clientId: clientId ?? "",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons />
    </PayPalScriptProvider>
  );
}