import React, { useMemo } from "react";
import CartShopSection from "./CartShopSection";
import { GroupCartItems } from "./GroupCartItems";
import { useCartItems } from "@/f/hooks/useCartItems";
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const Cart: React.FC<Props> = ({ lang }) => {
  const t = (messages.cartPage as any)[lang] ?? {};
  const cartItems = useCartItems();
  const groups = useMemo(() => GroupCartItems(cartItems), [cartItems]);

  return (
    <div className="max-w-2xl mx-auto py-8">
      {groups.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-500 text-lg">
          {t.empty}
        </div>
      ) : (
        groups.map((group) => (
          <CartShopSection products={group} lang={lang} />
        ))
      )}
    </div>
  );
};

export default Cart;