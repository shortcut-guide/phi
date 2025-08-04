import React from "react";
import CartItemRow from "./CartItemRow";
import CartShopAction from "./CartShopAction";

type Props = {
  items: any;
  lang: string;
};

const CartShopSection: React.FC<Props> = ({ items, lang }) => {
  return (
    <section className="mb-8">
      <ul className="divide-y">
        {items.map(item => (
          <CartItemRow item={item} lang={lang} />
        ))}
      </ul>
      <CartShopAction items={items} lang={lang} />
    </section>
  );
};

export default CartShopSection;