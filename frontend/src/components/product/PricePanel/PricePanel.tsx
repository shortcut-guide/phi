import React, { useState, useEffect } from "react";
import type { Product } from "@/f/types/product";
import { useCurrencyInfo } from "@/f/components/product/PricePanel/useCurrencyInfo";
import { useExchangeRate } from "@/f/utils/useExchangeRate";

type Props = { product: Product };

const PricePanel: React.FC<Props> = ({ product }) => {
  const ecData = product.ec_data || {};
  const currencyCode = product.currency;
  const currencySymbol = "¥";
  const currency = useCurrencyInfo(currencyCode);
  const currencyApiCode = currency.code || currencyCode || "JPY";
  const { rate } = useExchangeRate(currencyApiCode, "JPY");

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