import React from "react";
import PaypalButton from "@/f/components/payment/PaypalButton";

type Props = {
  isOwnShop: boolean;
  cartAddUrl?: string;
  items: any;
};

const CartShopAction: React.FC<Props> = ({ items }) => {
  if (isOwnShop)
    return (
      <div className="mt-4">
        <PaypalButton items={items} />
      </div>
    );
  if (cartAddUrl)
    return (
      <div className="mt-4">
        <a
          href={cartAddUrl}
          className="px-4 py-2 bg-orange-500 text-white rounded font-bold"
          target="_blank"
          rel="noopener"
        >
          まとめて{shop}のカートに入れる
        </a>
      </div>
    );
  return null;
};

export default CartShopAction;