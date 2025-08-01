import React, { useMemo } from "react";
import { useCartItems } from "@/f/hooks/useCartItems";
import CartShopSection from "./CartShopSection";
import { GroupCartItems } from "./GroupCartItems";
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const CartPage: React.FC = ({ lang }: Props) => {
  const t = (messages.cartPage as any)[lang] ?? {};
  const cartItems = useCartItems();
  const groups = useMemo(() => GroupCartItems(cartItems), [cartItems]);
  const hasOwnShop = groups.some((g) => g.isOwnShop);
  const hasOtherShop = groups.some((g) => !g.isOwnShop);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-xl font-bold mb-6">カート</h1>
      {groups.map((group) => (
        <CartShopSection key={group.shop} {...group} lang={lang} />
      ))}
      {/* 代理購入案内 */}
      {hasOwnShop && hasOtherShop && (
        <section className="mt-8 p-4 bg-yellow-100 rounded-xl">
          <p className="mb-2">{t.description}</p>
        </section>
      )}
    </div>
  );
};

export default CartPage;