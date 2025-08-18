import React from "react";
import CartItemRow from "./CartItemRow";
import CartShopAction from "./CartShopAction";
import { messages } from "@/f/config/messageConfig";

type Props = {
  items: any;
  lang: string;
  onCartUpdate: (updatedCart: any[]) => void;
};

const CartShopSection: React.FC<Props> = ({ items, lang, onCartUpdate }) => {
  const t = (messages.cartShopSection as any)[lang] ?? {};

  // グループ化ユーティリティ
  const getShopName = (item: any) =>
    item?.ec_data?.shop?.name || item?.products?.ec_data?.shop?.name || item?.shop?.name || "";

  const groupItemsByShop = (cartItems: any[]) => {
    const map: Record<string, any[]> = {};
    (cartItems || []).forEach((item) => {
      const shopName = getShopName(item) || t.shopetc;
      if (!map[shopName]) map[shopName] = [];
      map[shopName].push(item);
    });
    return map;
  };

  const grouped = groupItemsByShop(items || []);
  const shopNames = Object.keys(grouped);

  return (
    <section className="mb-8">
      <div className="space-y-6">
        {shopNames.length === 0 ? (
          <div className="text-gray-500">{t.noncart}</div>
        ) : (
          shopNames.map((shopName) => (
            <div key={shopName} className="border rounded bg-white p-4">
              <div className="divide-y">
                {grouped[shopName].map((item: any, idx: number) => (
                  <CartItemRow
                    key={item?.id ?? idx}
                    item={item}
                    lang={lang}
                    onCartUpdate={onCartUpdate}
                  />
                ))}
              </div>

              <div className="m-0">
                <CartShopAction items={grouped[shopName]} lang={lang} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CartShopSection;