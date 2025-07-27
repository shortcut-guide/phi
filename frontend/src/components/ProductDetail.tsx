// ProductDetail.tsx
import { useRouter } from 'next/router';
import { useState, useMemo } from 'react';
import { trackGAEvent } from "@/f/utils/track";
import { messages } from "@/f/config/messageConfig";
import { links } from "@/f/config/links";
import { getLangObj } from "@/f/utils/getLangObj";

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  diff: number;
  ec_data?: any;
}

type Props = {
  product: Product | null;
  onExpand: () => void;
  onClose: () => void;
}

export function ProductDetail({ product, onExpand, onClose }: Props) {
  if (!product) return null;

  const router = useRouter();
  const { lang } = router.query;
  const langValue = Array.isArray(lang) ? lang[0] : (lang ?? "ja");
  const t = getLangObj(messages.nav, langValue);
  const url = getLangObj<typeof links.url>(links.url);

  const basePrice = useMemo(() => {
    if (!product.ec_data) return null;

    const sizeGroup =
      product.ec_data.size ||
      product.ec_data.product?.size ||
      product.ec_data.product?.color ||
      product.ec_data.product;

    if (!sizeGroup || typeof sizeGroup !== 'object') return null;

    for (const key in sizeGroup) {
      const entry = sizeGroup[key];
      if (entry?.price === product.price) return entry.base_price;
    }

    return null;
  }, [product]);

  trackGAEvent("product_expand", {
    product_id: product.id,
    onExpand
  });

  return (
    <div className="w-full h-full bg-white border-t shadow-lg p-4 transition-all duration-300">
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-bold">{product.title}</h2>
        <button onClick={onClose} className="text-sm text-gray-500">×</button>
      </div>
      <img src={product.imageUrl} alt={product.title} className="w-full mt-2 rounded" />
      <p className="text-sm mt-2">{t.price}: ¥{basePrice ?? product.price}</p>
      <p className="text-sm text-red-500">{t.diffAmazon}: ¥{product.diff}</p>

      <div className="flex justify-between mt-4 gap-2">
        <button className="bg-blue-500 text-white px-4 py-1 rounded">{t.addToCart}</button>
        <button className="bg-yellow-400 text-black px-4 py-1 rounded">{t.favorite}</button>
        <button className="text-blue-600 underline text-sm">{t.productInfo}</button>
      </div>

      <div className="flex justify-between mt-4 gap-2">
        <button
          className="text-sm text-blue-700 underline"
          onClick={() => location.href = `${url.api.products}${product.id}`}
        >
          {t.detail}
        </button>
        <button
          className="text-sm text-green-600 underline"
          onClick={onExpand}
        >
          {t.expand}
        </button>
      </div>
    </div>
  );
}