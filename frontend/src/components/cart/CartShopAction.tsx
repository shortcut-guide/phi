import React from "react";
import PaypalButton from "@/f/components/payment/PaypalButton";
import { messages } from "@/f/config/messageConfig";

type Props = {
  items: any;
  lang: string;
};

const CartShopAction: React.FC<Props> = ({ items,lang }) => {
  const t = (messages.cartShopAction as any)[lang] ?? {};
  const shop = items?.ec_data?.shop;
  const productUrl = items?.ec_data?.product?.url;
  
  // ショップ情報が存在しない場合のエラーUI
  if (!shop || !shop.name) {
    return (
      <div className="mt-4 text-red-500 font-bold">
        {t?.shopInfoNotFound ?? "ショップ情報が取得できません"}
      </div>
    );
  }

  if (shop.name === "phi") {
    return (
      <div className="mt-4">
        <PaypalButton items={items} />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <a
        href={productUrl}
        className="px-4 py-2 bg-orange-500 text-white rounded font-bold"
        target="_blank"
        rel="noopener"
      >
        {t.addcart(shop.name)}
      </a>
    </div>
  );
};

export default CartShopAction;