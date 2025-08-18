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
      <div className="mt-4 text-gray-500 font-bold">{t.loadPayment}</div>
    );
  }

  const shopNames = getShopNames(items).filter(Boolean);
  // --- Platform/ShopConfig helper functions ---
  const getPlatformFromItem = (it: any): string => {
    return (
      it?.products?.platform ||
      it?.platform ||
      it?.products?.ec_data?.product?.platform ||
      it?.ec_data?.product?.platform ||
      ""
    );
  };

  const resolveShopConfigByPlatform = (platform: string) => {
    if (!platform) return undefined;
    const cap = platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase();
    const candidates = Array.from(new Set([platform, platform.toLowerCase(), platform.toUpperCase(), cap]));

    for (const k of candidates) {
      if (shopList?.[lang]?.[k]) return shopList[lang][k];
    }
    for (const k of candidates) {
      if (shopList?.[k]) return shopList[k];
    }
    return undefined;
  };

  // items はこのコンポーネントに渡されたショップ単位の配列である想定
  const firstItem = (items && items.length > 0) ? items[0] : null;
  const shopName = firstItem?.ec_data?.shop?.name || firstItem?.products?.ec_data?.shop?.name || firstItem?.shop?.name || "";
  const platform = firstItem ? getPlatformFromItem(firstItem) : "";
  const platformLabel = platform ? platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase() : shopName;
  const shopConfig = resolveShopConfigByPlatform(platform);
  const isPayPal = !!(shopConfig && typeof shopConfig.payment === "boolean" ? shopConfig.payment : false);
  const affiliateUrl = affiliateUrls[0] || "#";

  return (
    <div className="mt-0">
      <div className="shadow-sm">
        <div className="flex items-center">
          <div className="text-[0.6875em] font-semibold">{platformLabel}</div>
          <div className="text-[0.6875em] text-gray-500 ml-2">{shopName}</div>
        </div>

        <div className="mt-2">
          {isPayPal ? (
            <PaypalButton items={items} lang={lang} />
          ) : (
            <a
              href={affiliateUrl}
              className="block w-full bg-orange-500 hover:bg-blue-900 text-white font-bold rounded py-2 text-center text-base tracking-wide transition"
              target="_blank"
              rel="noopener"
            >
              {typeof t.affiliateCheckout === "function"
                ? t.affiliateCheckout(platformLabel)
                : t.shopBuy(platformLabel)}
            </a>
          )}
        </div>
      </div>
    </div>
  );

};

export default CartShopAction;