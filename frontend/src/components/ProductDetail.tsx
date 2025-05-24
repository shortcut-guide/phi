// ProductDetail.tsx
import { useState } from 'react';
import { trackGAEvent } from "@/f/utils/track";

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
  trackGAEvent("product_expand", {
    product_id: product.id,
    onExpand
  });

  if (!product) return null;

  return (
    <div className="w-full h-full bg-white border-t shadow-lg p-4 transition-all duration-300">
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-bold">{product.title}</h2>
        <button onClick={onClose} className="text-sm text-gray-500">×</button>
      </div>
      <img src={product.imageUrl} alt={product.title} className="w-full mt-2 rounded" />
      <p className="text-sm mt-2">価格: ¥{product.price}</p>
      <p className="text-sm text-red-500">Amazonとの差: ¥{product.diff}</p>

      <div className="flex justify-between mt-4 gap-2">
        <button className="bg-blue-500 text-white px-4 py-1 rounded">カートに入れる</button>
        <button className="bg-yellow-400 text-black px-4 py-1 rounded">お気に入り</button>
        <button className="text-blue-600 underline text-sm">商品情報</button>
      </div>

      <div className="flex justify-between mt-4 gap-2">
        <button className="text-sm text-blue-700 underline" onClick={() => location.href = `/products/${product.id}`}>詳細ページ</button>
        <button className="text-sm text-green-600 underline" onClick={onExpand}>広げる</button>
      </div>
    </div>
  );
}
