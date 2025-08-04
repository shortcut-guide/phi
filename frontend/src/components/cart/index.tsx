import React, { useMemo, useEffect } from "react";
import CartShopSection from "./CartShopSection";
import { GroupCartItems } from "./GroupCartItems";
import { getCart, CartItem } from "@/f/utils/cartStorage";
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const Cart: React.FC<Props> = ({ lang }) => {
  const t = useMemo(() => (messages.cartPage as any)[lang] ?? {}, [lang]);
  // cartItemsの取得・グループ化を一度のuseMemoに統合
  const { groups } = useMemo(() => {
    const cartItems = getCart();
    return { groups: cartItems };
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8">
      {groups.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-500 text-lg">
          {t.empty}
        </div>
      ) : (
        <CartShopSection items={groups} lang={lang} />
      )}
    </div>
  );
};

export default Cart;