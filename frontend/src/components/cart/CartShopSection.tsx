import React from "react";
import CartItemRow from "./CartItemRow";
import CartShopAction from "./CartShopAction";

type Props = {
  shop: string;
  isOwnShop: boolean;
  cartAddUrl?: string;
  items: { product: any; count: number }[];
  lang: string;
};

const CartShopSection: React.FC<Props> = ({ shop, isOwnShop, cartAddUrl, items, lang }) => (
  <section className="mb-8">
    <h2 className="text-lg font-semibold mb-2">
      {isOwnShop ? "phis" : shop}
    </h2>
    <ul className="divide-y">
      {items.map(({ product, count }) => (
        <CartItemRow key={product.id} item={product} lang={lang} />
      ))}
    </ul>
    <CartShopAction isOwnShop={isOwnShop} cartAddUrl={cartAddUrl} items={items} shop={shop} />
  </section>
);

export default CartShopSection;