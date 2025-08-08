import React from "react";
import CartItemRow from "./CartItemRow";
import CartShopAction from "./CartShopAction";

type Props = {
  items: any;
  lang: string;
  onCartUpdate: (updatedCart: any[]) => void;
};

const CartShopSection: React.FC<Props> = ({ items, lang, onCartUpdate }) => {
  return (
    <section className="mb-8">
      <div className="divide-y">
        {items.map(item => (
          <CartItemRow item={item} lang={lang} onCartUpdate={onCartUpdate} />
        ))}
      </div>
      <CartShopAction items={items} lang={lang} />
    </section>
  );
};

export default CartShopSection;