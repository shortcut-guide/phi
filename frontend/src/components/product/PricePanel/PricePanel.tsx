import React, { useState, useEffect } from "react";
import type { Product } from "@/f/types/product";
import { useCurrencyInfo } from "@/f/components/product/PricePanel/useCurrencyInfo";

type Props = { product: Product };

const PricePanel: React.FC<Props> = ({ product }) => {
  const ecData = product.ec_data || {};
  const currencyCode = product.currency;
  // 常に円表記
  const currencySymbol = "¥";
  const currency = useCurrencyInfo(currencyCode);
  const currencyApiCode = currency.code || currencyCode || "JPY";
  const [rate, setRate] = useState(1);

  useEffect(() => {
    fetch(`https://api.exchangerate-api.com/v4/latest/${currencyApiCode}`)
      .then((res) => res.json())
      .then((data) => {
        const jpyRate = data.rates?.JPY;
        if (typeof jpyRate === "number") setRate(jpyRate);
        else setRate(1);
      })
      .catch(() => setRate(1));
  }, [currencyApiCode]);

  const basePriceRaw = product.base_price ?? ecData.base_price;
  const priceRaw = product.price ?? ecData.price;
  const basePrice = typeof basePriceRaw === "number" ? basePriceRaw : undefined;
  const price = typeof priceRaw === "number" ? priceRaw : undefined;

  if (basePrice === undefined && price === undefined) return null;

  return (
    <ul className="flex items-center mt-1">
      {typeof price === "number" && (
        <li id="price" className="text-xs font-bold leading-1">
          {currencySymbol}
          {Math.round(price * rate).toLocaleString()}
        </li>
      )}
      {typeof basePrice === "number" && price !== basePrice && (
        <li id="base_price" className="text-[0.6875em] ml-2 text-gray-500 line-through leading-1">
          {currencySymbol}
          {Math.round(basePrice * rate).toLocaleString()}
        </li>
      )}
    </ul>
  );
};

export default PricePanel;