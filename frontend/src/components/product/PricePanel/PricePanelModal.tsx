import React, { useState, useEffect } from "react";
import type { Product } from "@/f/types/product";
import { useCurrencyInfo } from "@/f/components/product/PricePanel/useCurrencyInfo";

type Props = { product: Product };

const PricePanelModal: React.FC<Props> = ({ product }) => {
  const ecData = product.ec_data || {};
  const currencyCode = product.currency;
  const currency = useCurrencyInfo(currencyCode);
  const currencyApiCode = currency.code || currencyCode || "JPY";
  const currencySymbol = currency.symbol;
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
    <div className="flex flex-col items-center mt-3 text-xs font-bold">
      {typeof price === "number" && (
        <div>
          <span>{currencySymbol}{price.toLocaleString()} {currency.label}</span>
          <span className="mx-2">→</span>
          <span>¥{Math.round(price * rate).toLocaleString()}</span>
        </div>
      )}
      {typeof basePrice === "number" && price !== basePrice && (
        <div className="text-gray-500 line-through">
          <span>{currencySymbol}{basePrice.toLocaleString()} {currency.label}</span>
          <span className="mx-2">→</span>
          <span>¥{Math.round(basePrice * rate).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export default PricePanelModal;