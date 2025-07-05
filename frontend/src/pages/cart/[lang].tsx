import { useEffect } from "react";
import { paypalClientId } from "@/f/config/paypalConfig";
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const CartPage = ({ lang }: Props) => {
  const t = (messages.cartPage as any)[lang] ?? {};

  useEffect(() => {
    // 1. PayPal SDKのscriptを動的挿入
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`;
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.paypal) {
        initPayPal();
      }
    };
    document.body.appendChild(script);

    // 2. PayPalボタン初期化
    async function initPayPal() {
      try {
        const res = await fetch("/api/csrf");
        const data = await res.json();
        const csrfToken = data.token;

        // @ts-ignore
        window.paypal.Buttons({
          createOrder: async () => {
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ productId: "product-001" })
            });
            const { orderID } = await res.json();
            return orderID;
          },
          onApprove: async (data: any) => {
            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ orderID: data.orderID }),
            });
            const result = await res.json();
            alert(`${t.success}: ${result.status}`);
          },
        }).render("#paypal-button-container");
      } catch (err) {
        console.error("Failed to initialize PayPal Buttons:", err);
      }
    }

    // クリーンアップ
    return () => {
      document.body.removeChild(script);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
      <div id="paypal-button-container"></div>
    </div>
  );
};

export default CartPage;
