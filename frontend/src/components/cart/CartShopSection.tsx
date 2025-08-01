import React from "react";
import CartItemRow from "./CartItemRow";
import CartShopAction from "./CartShopAction";

type Props = {
  products: any;
  lang: string;
};

const CartShopSection: React.FC<Props> = ({ products, lang }) => (
  <section className="mb-8">
    <ul className="divide-y">
      {products.map(({ product }) => (
        <CartItemRow key={product.id} item={product} lang={lang} />
      ))}
    </ul>
    <CartShopAction items={products} />
  </section>
);

export default CartShopSection;