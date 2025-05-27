import React from 'react';
import { trackGAEvent } from "@/f/utils/track";
import { Icon } from 'astro-icon/components'
import { messages } from "@/f/config/messageConfig";
import { getLang } from "@/f/utils/lang";

const lang = getLang();
const t = messages.productDetail[lang];

type Props = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  lang: 'en' | 'ja';
};

export const ProductCard = ({ id, name, price, imageUrl, description, lang }: Props) => {
  const t = messages.productCard[lang];

  return (
    <div className="rounded-2xl shadow-md p-4 bg-white hover:shadow-lg transition">
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover rounded-xl mb-4" />
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">{description}</p>
      <p className="text-indigo-600 font-bold mt-2">{t.currency}{price.toLocaleString()}</p>
      <a href={`/product/${id}`} className="text-sm text-blue-500 hover:underline" onClick={() => trackGAEvent("product_click", {
        product_id: id,
        productname: name
      })}>
        {t.detail}
      </a>
    </div>
  );
};