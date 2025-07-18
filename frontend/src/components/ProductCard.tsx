import React, { useState, useMemo } from "react";
import type { Product } from "@/f/types/product";
import { getAllInfoByISO } from "iso-country-currency";
import { messages } from "@/f/config/messageConfig";

// 汎用：ec_dataラベル自動生成
const labelize = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

// 画像スライダー
const ImageSlider = ({ images }: { images: string[] }) =>
  !images?.length ? null : (
    <div className="overflow-hidden w-full py-2">
      <div className="flex flex-nowrap overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            className="object-contain rounded-lg bg-gray-50 snap-center min-w-full max-w-full transition-transform duration-500 hover:scale-105"
            style={{ height: "8rem" }}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );

// 複雑な多重構造画像対応
const FlexibleImages: React.FC<{ images: any }> = ({ images }) => {
  if (Array.isArray(images)) return <ImageSlider images={images} />;
  if (typeof images === "object" && images !== null) {
    const parentKeys = Object.keys(images);
    const [activeParent, setActiveParent] = useState(parentKeys[0]);
    const [activeChild, setActiveChild] = useState(Object.keys(images[activeParent])[0]);
    React.useEffect(() => {
      setActiveChild(Object.keys(images[activeParent])[0]);
    }, [activeParent]);
    const childKeys = Object.keys(images[activeParent]);
    const activeImages = Array.isArray(images[activeParent][activeChild]) ? images[activeParent][activeChild] : [];
    return (
      <div>
        <ImageSlider images={activeImages} />
        <div className="flex gap-2 mt-1 overflow-x-auto whitespace-nowrap scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {childKeys.map((child) => (
            <button
              key={child}
              className={`inline-block min-w-fit px-2 text-black text-[0.6875em] ${child === activeChild ? "bg-blue-400 text-white" : "bg-gray-100"}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveChild(child);
              }}
              type="button"
            >
              {child}
            </button>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// description：改行＆余白あり
const DescriptionBlock: React.FC<{ text?: string }> = ({ text }) =>
  !text ? null : (
    <div className="mb-4">
      {text.split("\n").map((line, i) =>
        line.trim() ? (
          <div key={i} className="text-[0.6875em] font-bold text-black text-left mb-2 leading-tight">
            {line}
          </div>
        ) : (
          <div key={i} className="mb-2" />
        )
      )}
    </div>
  );

// タブ付きスペック
const TabbedSpec: React.FC<{
  label: string;
  data: Record<string, any>;
  active: string;
  setActive: (tab: string) => void;
  dict: any;
}> = ({ label, data, active, setActive, dict }) => (
  <div className="col-span-2 bg-blue-50 rounded px-2 py-2 text-xs text-blue-700 font-semibold flex flex-col min-w-0 max-w-full">
    <div className="text-blue-500 mb-1 break-keep">{dict[label] ?? labelize(label)}</div>
    <div className="flex gap-1 mb-2">
      {Object.keys(data).map((tab) => (
        <button
          key={tab}
          className={`px-2 py-1 rounded ${active === tab ? "bg-blue-500 text-white" : "bg-gray-100 text-blue-700"}`}
          onClick={(e) => {
            e.stopPropagation();
            setActive(tab);
          }}
          type="button"
        >
          {dict[tab] ?? tab}
        </button>
      ))}
    </div>
    <div className="bg-white rounded px-2 py-1 text-blue-900">
      {Object.entries(data[active])
        .filter(([k]) => k !== "base_price" && k !== "price")
        .map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-gray-500">{dict[k] ?? labelize(k)}:</span>
            <span>{dict[String(v)] ?? String(v)}</span>
          </div>
        ))}
    </div>
  </div>
);

// 汎用スペック
const GenericSpec: React.FC<{ label: string; value: any; dict: any }> = ({ label, value, dict }) => (
  <div className="bg-blue-50 rounded px-2 py-1 text-xs text-blue-700 font-semibold flex flex-col min-w-0 max-w-full">
    <div className="text-blue-500 mb-1 break-keep">{dict[label] ?? labelize(label)}</div>
    <div className="break-all whitespace-pre-wrap bg-white rounded px-1 py-0.5 text-blue-900">
      {typeof value === "object" ? JSON.stringify(value, null, 2) : (dict[value] ?? String(value))}
    </div>
  </div>
);

// 価格パネル（タブ付き含む）
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

  // バリエーションキー検出
  const ecData = product.ec_data || {};
  const priceGroupKeys = Object.entries(ecData)
    .filter(
      ([, value]) =>
        value &&
        typeof value === "object" &&
        Object.values(value).every((v) => v && typeof v === "object" && ("base_price" in v || "price" in v))
    )
    .map(([key]) => key);

  // タブ管理
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
              onClick={(e) => {
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

type ProductCardProps = {
  product: Product;
  onClick?: (product: Product) => void;
  className?: string;
  children?: React.ReactNode;
  lang: string;
  t?: any;
} & React.HTMLAttributes<HTMLDivElement>;

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, className = "", children, lang, ...rest }) => {
  const [modalOpen, setModalOpen] = useState(false);

  // 翻訳辞書
  const dict = messages.productSpec?.[lang] ?? {};

  // ec_dataからスペックを分離
  const ecData = product.ec_data || {};
  const tabbedKeys = useMemo(
    () =>
      Object.entries(ecData)
        .filter(
          ([, value]) =>
            value &&
            typeof value === "object" &&
            Object.values(value).every(
              (v) => v && typeof v === "object" && ("base_price" in v || "price" in v)
            )
        )
        .map(([key]) => key),
    [ecData]
  );
  const [activeTabs, setActiveTabs] = useState(
    Object.fromEntries(tabbedKeys.map((key) => [key, Object.keys(ecData[key])[0]]))
  );

  return (
    <>
      <div
        className={
          "bg-white rounded-2xl shadow-md overflow-hidden max-w-xs my-1 transform transition-transform hover:scale-[1.02] cursor-pointer " +
          className
        }
        onClick={() => {
          setModalOpen(true);
          if (onClick) onClick(product);
        }}
        {...rest}
      >
        {ecData.images && <FlexibleImages images={ecData.images} />}
        <div className="py-1 px-4">
          {product.name && (
            <h2 className="text-[0.6875em] font-semibold mb-1 line-clamp-2 leading-tight">
              {product.name}
            </h2>
          )}

          {typeof ecData.review_rate === 'number' && typeof ecData.review_count === 'number' && (
            <div className="flex items-center gap-1 text-[0.625em] text-gray-500 mb-1">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => {
                  const isFilled = i < Math.floor(ecData.review_rate);
                  return (
                    <svg
                      key={i}
                      className={`lucide ${isFilled ? 'lucide-star fill-orange-400' : 'lucide-star text-gray-300'} w-3 h-3`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  );
                })}
              </div>
              <span>({ecData.review_count.toLocaleString()})</span>
            </div>
          )}

          {typeof product.point === 'number' && (
            <div className="text-[0.625em] text-blue-500 font-medium mb-1">
              {product.point.toLocaleString()} pt
            </div>
          )}

          <PricePanel product={product} />
          {children}
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-0">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={() => setModalOpen(false)} aria-label="閉じる">×</button>
            {ecData.images && (
              <div className="flex justify-center items-center bg-gray-100 rounded-t-xl p-4">
                <FlexibleImages images={ecData.images} />
              </div>
            )}
            <div className="p-6">
              {product.name && <h2 className="text-[0.6875em] font-bold text-left mb-1">{product.name}</h2>}
              <div className="mb-2 text-center">
                <PricePanel product={product} />
              </div>
              {/* description */}
              <DescriptionBlock text={product.description} />
              <DescriptionBlock text={ecData.description} />
              {/* スペックタグ：タブ付き */}
              <div className="mb-2 grid grid-cols-2 gap-2">
                {Object.entries(ecData)
                  .filter(
                    ([key, value]) =>
                      key !== "images" &&
                      key !== "description" &&
                      key !== "base_price" &&
                      key !== "price" &&
                      key !== "size" &&
                      value !== undefined &&
                      value !== null
                  )
                  .map(([key, value]) => {
                    if (tabbedKeys.includes(key)) {
                      return (
                        <TabbedSpec
                          key={key}
                          label={key}
                          data={value}
                          active={activeTabs[key] || Object.keys(value)[0]}
                          setActive={(tab) => setActiveTabs((prev) => ({ ...prev, [key]: tab }))}
                          dict={dict}
                        />
                      );
                    } else if (key === "category" && Array.isArray(value)) {
                      return (
                        <div key={key} className="bg-blue-50 rounded px-2 py-1 text-xs text-blue-700 font-semibold flex flex-col min-w-0 max-w-full">
                          <div className="text-blue-500 mb-1 break-keep">{dict[key] ?? labelize(key)}</div>
                          <div className="flex flex-wrap gap-1">
                            {value.map((cat: string, idx: number) => (
                              <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[0.65rem]">
                                {dict[cat] ?? cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    } else {
                      return <GenericSpec key={key} label={key} value={value} dict={dict} />;
                    }
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;