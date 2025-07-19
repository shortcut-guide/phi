import React, { useState } from "react";
import { getAllInfoByISO } from "iso-country-currency";
import type { Product } from "@/f/types/product";

const PricePanel: React.FC<{ product: Product }> = ({ product }) => {
  const getCurrencyInfo = () => {
    const rawCountry = product.ec_data?.country;
    const country = typeof rawCountry === "string" && rawCountry.length === 2 ? rawCountry.toUpperCase() : null;
    try {
      const info = country ? getAllInfoByISO(country) : null;
      const code = info?.currency ?? "USD";
      const symbol = info?.symbol ?? "$";
      return { symbol, label: code };
    } catch (err) {
      return { symbol: "$", label: "USD" };
    }
  };
  const currency = getCurrencyInfo();

  const ecData = product.ec_data || {};
  const priceGroupKeys = Object.entries(ecData)
    .filter(
      ([, value]) =>
        value &&
        typeof value === "object" &&
        Object.values(value).every((v) => v && typeof v === "object" && ("base_price" in v || "price" in v))
    )
    .map(([key]) => key);

  const [activeTabs, setActiveTabs] = useState(
    Object.fromEntries(priceGroupKeys.map((key) => [key, Object.keys(ecData[key])[0]]))
  );

  if (priceGroupKeys.length === 0) {
    const basePrice = product.base_price ?? ecData.base_price;
    const price = product.price ?? ecData.price;
    if (!basePrice && !price) return null;
    return (
      <div className="flex mt-3 text-xs font-bold">
        {basePrice && (
          <div id="base_price">
            {currency.symbol}{basePrice.toLocaleString()}
          </div>
        )}
        {price && price !== basePrice && (
          <div id="price" className="ml-2 text-gray-500 line-through">
            {currency.symbol}{price.toLocaleString()}
          </div>
        )}
      </div>
    );
  }

  return priceGroupKeys.map((parentKey) => {
    const group = ecData[parentKey];
    const tabKeys = Object.keys(group);
    const activeTab = activeTabs[parentKey] || tabKeys[0];
    return (
      <div key={parentKey} className="mt-2">
        <div className="flex gap-1 mb-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabKeys.map((tab) => (
            <button
              key={tab}
              className={`px-1 py-1 text-[0.6875em] leading-[0.6875em] rounded ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-100"}`}
              onClick={e => {
                e.stopPropagation();
                setActiveTabs((prev) => ({ ...prev, [parentKey]: tab }));
              }}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
        {group[activeTab] && (
          <div className="flex text-xs font-bold">
            {group[activeTab].base_price && (
              <div id="base_price">
                {currency.symbol}{group[activeTab].base_price.toLocaleString()}
              </div>
            )}
            {group[activeTab].price && group[activeTab].price !== group[activeTab].base_price && (
              <div id="price" className="ml-2 text-gray-500 line-through">
                {currency.symbol}{group[activeTab].price.toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>
    );
  });
};

export default PricePanel;
