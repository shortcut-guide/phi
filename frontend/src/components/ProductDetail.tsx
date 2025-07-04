// ProductDetail.tsx
import { useState } from 'react';
import { trackGAEvent } from "@/f/utils/track";
import { messages } from "@/f/config/messageConfig";

const lang = "__MSG_LANG__";
const t = ((messages.productDetail as any)[lang]) ?? {};

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  diff: number;
}

interface Props {
  product: Product | null;
  onExpand: () => void;
  onClose: () => void;
}

export function ProductDetail({ product, onExpand, onClose }: Props) {
  if (!product) return null;
  
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
      <p className="text-sm mt-2">{t.price}: ¥{product.price}</p>
      <p className="text-sm text-red-500">{t.diffAmazon}: ¥{product.diff}</p>

      <div className="flex justify-between mt-4 gap-2">
        <button className="bg-blue-500 text-white px-4 py-1 rounded">{t.addToCart}</button>
        <button className="bg-yellow-400 text-black px-4 py-1 rounded">{t.favorite}</button>
        <button className="text-blue-600 underline text-sm">{t.productInfo}</button>
      </div>

      <div className="flex justify-between mt-4 gap-2">
        <button className="text-sm text-blue-700 underline" onClick={() => location.href = `/products/${product.id}`}>詳細ページ</button>
        <button className="text-sm text-green-600 underline" onClick={onExpand}>{t.expand}</button>
      </div>
    </div>
  );
}
