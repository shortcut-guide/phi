import React from "react";
import PaypalButton from "@/f/components/payment/PaypalButton";
import { messages } from "@/f/config/messageConfig";

type Props = {
  items: any;
  lang: string;
};

const CartShopAction: React.FC<Props> = ({ items,lang }) => {
  const t = (messages.cartShopAction as any)[lang] ?? {};

  if (items.shop_name === "phis") {
    return (
      <div className="mt-4">
        <PaypalButton items={items} />
      </div>
    );
  } 

  return (
    <div className="mt-4">
      <a
        href={items.ec_data.product.url}
        className="px-4 py-2 bg-orange-500 text-white rounded font-bold"
        target="_blank"
        rel="noopener"
      >
        {t.addcart(items.shop_name)}
      </a>
    </div>
  );
};

export default CartShopAction;