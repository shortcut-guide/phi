import React, { useMemo, useEffect, useState } from "react";
import CartShopSection from "./CartShopSection";
import { GroupCartItems } from "./GroupCartItems";
import { getCart, CartItem } from "@/f/utils/cartStorage";
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const Cart: React.FC<Props> = ({ lang }) => {
  const t = useMemo(() => (messages.cartPage as any)[lang] ?? {}, [lang]);
  const [groups, setGroups] = useState<CartItem[]>([]);

  useEffect(() => {
    setGroups(getCart());
  }, []);

  const handleCartUpdate = (updatedCart: CartItem[]) => {
    setGroups(updatedCart);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {groups.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-500 text-lg">
          {t.empty}
        </div>
      ) : (
        <CartShopSection items={groups} lang={lang} onCartUpdate={handleCartUpdate} />
      )}
    </div>
  );
};

export default Cart;