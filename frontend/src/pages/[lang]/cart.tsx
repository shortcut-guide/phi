import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { messages } from "@/f/config/messageConfig";
import { useCallback } from "react";
import { paypalClientId } from "@/f/config/paypalConfig";
import { useCartItems } from "@/f/hooks/useCartItems";

type Props = {
  lang: string;
};

const CartPage = ({ lang }: Props) => {
  const t = (messages.cartPage as any)[lang] ?? {};
  const cartItems = useCartItems();

  // createOrderコールバック
  const createOrder = useCallback(async () => {
    const res = await fetch("/api/csrf");
    const { token } = await res.json();
    const resOrder = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productId: "product-001" })
    });
    const { orderID } = await resOrder.json();
    return orderID;
  }, []);

  // onApproveコールバック
  const onApprove = useCallback(async (data: any) => {
    const res = await fetch("/api/csrf");
    const { token } = await res.json();
    const resCapture = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ orderID: data.orderID })
    });
    const result = await resCapture.json();
    return result;
  }, []);

  const isEmpty = !cartItems || cartItems.length === 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
      {isEmpty ? (
        <div className="text-center text-gray-500 py-10">
          {t.emptyMessage}
        </div>
      ) : (
        <PayPalScriptProvider options={{
          "clientId": paypalClientId,
          currency: "USD"
        }}>
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default CartPage;