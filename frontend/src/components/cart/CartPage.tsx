import React, { useMemo } from "react";
import { useCartItems } from "@/f/hooks/useCartItems";
import CartShopSection from "./CartShopSection";
import { GroupCartItems } from "./GroupCartItems";

const CartPage: React.FC = () => {
  const cartItems = useCartItems();
  const groups = useMemo(() => GroupCartItems(cartItems), [cartItems]);
  const hasOwnShop = groups.some((g) => g.isOwnShop);
  const hasOtherShop = groups.some((g) => !g.isOwnShop);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-xl font-bold mb-6">カート</h1>
      {groups.map((group) => (
        <CartShopSection key={group.shop} {...group} />
      ))}
      {/* 代理購入案内 */}
      {hasOwnShop && hasOtherShop && (
        <section className="mt-8 p-4 bg-yellow-100 rounded-xl">
          <p className="mb-2">複数ショップから購入の場、代理購入がおすすめです。</p>
          {/* 代理購入UI追加エリア */}
        </section>
      )}
    </div>
  );
};

export default CartPage;