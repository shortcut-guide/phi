import React from "react";
import CartItemRow from "./CartItemRow";
import CartShopAction from "./CartShopAction";

type Props = {
  shop: string;
  isOwnShop: boolean;
  cartAddUrl?: string;
  items: { product: any; count: number }[];
};

const CartShopSection: React.FC<Props> = ({ shop, isOwnShop, cartAddUrl, items }) => (
  <section className="mb-8">
    <h2 className="text-lg font-semibold mb-2">
      {isOwnShop ? "自社販売商品" : shop}
    </h2>
    <ul className="divide-y">
      {items.map(({ product, count }) => (
        <CartItemRow key={product.id} product={product} count={count} isOwnShop={isOwnShop} />
      ))}
    </ul>
    <CartShopAction isOwnShop={isOwnShop} cartAddUrl={cartAddUrl} items={items} shop={shop} />
  </section>
);

export default CartShopSection;