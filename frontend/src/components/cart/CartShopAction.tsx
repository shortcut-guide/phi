import React, { useEffect, useState } from "react";
import PaypalButton from "@/f/components/payment/PaypalButton";
import { messages } from "@/f/config/messageConfig";
import { fetchShopList, toAffiliateLink } from "@/f/utils/affiliateLink";

type CartItem = any; // 型定義は必要に応じて

type Props = {
  items: CartItem[];
  lang: string;
};

const CartShopAction: React.FC<Props> = ({ items, lang }) => {
  const t = (messages.cartShopAction as any)[lang] ?? {};
  const [shopList, setShopList] = useState<any>(null);
  const [affiliateUrls, setAffiliateUrls] = useState<string[]>([]);

  // ショップ名取得
  const getShopNames = (cartItems: CartItem[]) =>
    cartItems.map(
      (item) =>
        item?.ec_data?.shop?.name ||
        item?.products?.ec_data?.shop?.name ||
        item?.shop?.name ||
        ""
    );

  // ショップ毎に商品グループ化
  const groupItemsByShop = (cartItems: CartItem[]) => {
    const map: Record<string, CartItem[]> = {};
    cartItems.forEach((item) => {
      const shopName =
        item?.ec_data?.shop?.name ||
        item?.products?.ec_data?.shop?.name ||
        item?.shop?.name ||
        "";
      if (!shopName) return;
      if (!map[shopName]) map[shopName] = [];
      map[shopName].push(item);
    });
    return map;
  };

  useEffect(() => {
    fetchShopList(lang).then((data) => {
      console.log("shopList API result:", data); // ←追加
      setShopList(data);
    });
  }, [lang]);

  // アフィリエイトリンク生成（toAffiliateLink.tsのみを使用）
  useEffect(() => {
    if (!shopList || !items?.length) return;
    Promise.all(
      items.map(async (item) => {
        const url =
          item?.ec_data?.product?.url ||
          item?.products?.ec_data?.product?.url ||
          item?.url ||
          "#";
        return await toAffiliateLink(url); // 必ずaffiliateLink.ts経由
      })
    ).then(setAffiliateUrls);
  }, [shopList, items]);

  if (!shopList) {
    return (
      <div className="mt-4 text-gray-500 font-bold">決済方法を取得中...</div>
    );
  }

  const shopNames = getShopNames(items).filter(Boolean);
  const uniqueShopNames = Array.from(new Set(shopNames));
  const groupedItems = groupItemsByShop(items);

  // ショップごとのpayment判定
  const paymentMap: Record<string, boolean> = {};
  uniqueShopNames.forEach((shopName) => {
    const shopConfig =
      shopList[lang]?.[shopName] ||
      shopList[lang]?.[shopName.toLowerCase()] ||
      shopList[lang]?.[shopName.toUpperCase()];
    paymentMap[shopName] = !!shopConfig?.payment;
  });

  // PayPal決済用の商品
  const paypalItems: CartItem[] = [];
  uniqueShopNames.forEach((shopName) => {
    if (paymentMap[shopName]) {
      paypalItems.push(...(groupedItems[shopName] || []));
    }
  });

  // アフィリエイト（payment:false）商品ごとに
  const affiliateItems: {
    item: CartItem;
    idx: number;
    shopName: string;
    url: string;
  }[] = [];
  uniqueShopNames.forEach((shopName) => {
    if (!paymentMap[shopName]) {
      (groupedItems[shopName] || []).forEach((item, i) => {
        const affiliateUrl = affiliateUrls[items.indexOf(item)] || "#";
        affiliateItems.push({ item, idx: i, shopName, url: affiliateUrl });
      });
    }
  });

  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* PayPal決済 */}
      {paypalItems.length > 0 && (
        <div>
          <PaypalButton items={paypalItems} />
        </div>
      )}
      {/* アフィリエイトリンク */}
      {affiliateItems.map(({ item, idx, shopName, url }) => (
        <a
          key={`${shopName}-${idx}`}
          href={url}
          className="px-4 py-2 bg-orange-500 text-white rounded font-bold block"
          target="_blank"
          rel="noopener"
        >
          {typeof t.affiliateCheckout === "function"
            ? t.affiliateCheckout(shopName)
            : `${shopName}で購入`}
        </a>
      ))}
    </div>
  );
};

export default CartShopAction;