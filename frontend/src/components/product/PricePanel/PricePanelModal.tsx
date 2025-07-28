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
  const isJpyToJpy = currencyApiCode === "JPY";

  useEffect(() => {
    if (isJpyToJpy) {
      setRate(1);
      return;
    }
    fetch(`https://api.exchangerate-api.com/v4/latest/${currencyApiCode}`)
      .then((res) => res.json())
      .then((data) => {
        const jpyRate = data.rates?.JPY;
        if (typeof jpyRate === "number") setRate(jpyRate);
        else setRate(1);
      })
      .catch(() => setRate(1));
  }, [currencyApiCode, isJpyToJpy]);

  const basePriceRaw = product.base_price ?? ecData.base_price;
  const priceRaw = product.price ?? ecData.price;
  const basePrice = typeof basePriceRaw === "number" ? basePriceRaw : undefined;
  const price = typeof priceRaw === "number" ? priceRaw : undefined;

  if (basePrice === undefined && price === undefined) return null;

  // 円換算価格を計算
  const convertToJpy = (amount: number) => {
    if (isJpyToJpy) return amount;
    return Math.round(amount * rate);
  };

  // 元通貨価格表示（円以外の場合のみ）
  const renderOriginalPrice = (amount: number) => {
    if (isJpyToJpy) return null;
    return (
      <span className="ml-1 text-[0.6875em] text-gray-500">
        ({currencyApiCode} {amount.toLocaleString()})
      </span>
    );
  };

  return (
    <div className="flex items-baseline space-x-2 mt-4">
      {price !== undefined && (
        <span className="text-xs font-bold flex items-baseline">
          <span>¥{convertToJpy(price).toLocaleString()}</span>
          {renderOriginalPrice(price)}
        </span>
      )}
      {basePrice !== undefined && basePrice !== price && (
        <span className="text-[0.6875em] text-gray-700 flex items-baseline line-through">
          <span>¥{convertToJpy(basePrice).toLocaleString()}</span>
          {renderOriginalPrice(basePrice)}
        </span>
      )}
    </div>
  );
};

export default PricePanelModal;