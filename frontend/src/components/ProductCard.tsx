import React, { useState } from 'react';
import type { Product } from "@/f/types/product";
import { getAllInfoByISO } from 'iso-country-currency';

const ImageSlider = ({ images }: { images: string[] }) => {
  if (!Array.isArray(images) || images.length === 0) return null;
  return (
    <div
      className="overflow-hidden w-full py-2"
      style={{ position: "relative" }}
    >
      <div
        className="flex flex-nowrap overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
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
};

const FlexibleImages: React.FC<{ images: any }> = ({ images }) => {
  if (Array.isArray(images)) {
    return <ImageSlider images={images} />;
  }
  if (typeof images === 'object' && images !== null) {
    const parentKeys = Object.keys(images);
    const [activeParent, setActiveParent] = useState(parentKeys[0]);
    const [activeChild, setActiveChild] = useState(Object.keys(images[parentKeys[0]])[0]);

    // 親が変わったときに、子もその親の先頭にリセット
    React.useEffect(() => {
      setActiveChild(Object.keys(images[activeParent])[0]);
    }, [activeParent]);

    const childKeys = Object.keys(images[activeParent]);
    const activeImages = Array.isArray(images[activeParent][activeChild])
      ? images[activeParent][activeChild]
      : [];

    return (
      <div>
        <ImageSlider images={activeImages} />
        <div
          className="flex gap-2 mt-1 overflow-x-auto whitespace-nowrap scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {childKeys.map(child => (
            <button
              key={child}
              className={`inline-block min-w-fit px-2 text-black text-[0.6875em] ${child === activeChild ? 'bg-blue-400 text-white' : 'bg-gray-100'}`}
              onClick={e => { e.stopPropagation(); setActiveChild(child); }}
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

type ProductCardProps = {
  product: Product;
  onClick?: (product: Product) => void;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  className = "",
  children,
  ...rest
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // images以外のパラメータ自動リスト
  const renderEcData = () => {
    if (!product.ec_data) return null;
    return (
      <div className="mt-2 text-[0.6875em] text-gray-600">
        {Object.entries(product.ec_data)
          .filter(([key, value]) => key !== "images" && value)
          .map(([key, value]) => (
            <div key={key} className="mb-1">
              <span className="font-semibold">{key}:</span>{" "}
              {typeof value === "object" ? JSON.stringify(value) : String(value)}
            </div>
          ))}
      </div>
    );
  };

  // 価格表示ロジック（関数で再利用可）
  const PricePanel: React.FC = () => {
    // 親の候補を自動検出
    const getPriceGroupKeys = () => {
      if (!product.ec_data) return [];
      return Object.entries(product.ec_data)
        .filter(
          ([, value]) =>
            value && typeof value === 'object' && 
            Object.values(value).every(
              v => v && typeof v === 'object' && ('base_price' in v || 'price' in v)
            )
        )
        .map(([key]) => key);
    };

    const getCurrencyInfo = () => {
      const rawCountry = product.ec_data?.country;
      const country = typeof rawCountry === 'string' && rawCountry.length === 2
        ? rawCountry.toUpperCase()
        : null;

      try {
        const info = country ? getAllInfoByISO(country) : null;
        const code = info?.currency ?? 'USD';
        const symbol = info?.symbol ?? '$';
        return { symbol, label: code };
      } catch (err) {
        console.error('Currency lookup failed:', err);
        return { symbol: '$', label: 'USD' };
      }
    };
    const currency = getCurrencyInfo();

    const priceGroups = getPriceGroupKeys();
    const [activeTab, setActiveTab] = React.useState<string | null>(
      priceGroups.length > 0 ? Object.keys(product.ec_data[priceGroups[0]])[0] : null
    );

    // 親なしでbase_price/priceだけの場合
    if (priceGroups.length === 0) {
      const basePrice = product.base_price ?? product.ec_data?.base_price;
      const price = product.price ?? product.ec_data?.price;
      if (!basePrice && !price) return null;
      return (
        <div className="flex mt-3 text-xs font-bold">
          {basePrice && (
            <div id="base_price">{currency.symbol + basePrice.toLocaleString()}</div>
          )}
          {price && price !== basePrice && (
            <div id="price" className="ml-2">{currency.symbol + price.toLocaleString()}</div>
          )}
        </div>
      );
    }

    // 親（sizeやtypeなど）がある場合
    return priceGroups.map(parentKey => {
      const group = product.ec_data[parentKey];
      const tabKeys = Object.keys(group);
      return (
        <div key={parentKey} className="mt-2">
          {/* タブ */}
          <div className="flex gap-1 mb-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {tabKeys.map(tab => (
              <button
                key={tab}
                className={`px-1 py-1 text-[0.6875em] rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={e => {
                  e.stopPropagation();
                  setActiveTab(tab);
                }}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
          {/* 選択されたタブの価格を表示 */}
          {activeTab && group[activeTab] && (
            <div className="flex text-xs">
              {group[activeTab].base_price && (
                <div id="base_price" className="font-bold">{currency.symbol + group[activeTab].base_price.toLocaleString()}</div>
              )}
              {group[activeTab].price && (
                <div id="price" className="ml-2 text-gray-500 line-through">{currency.symbol + group[activeTab].price.toLocaleString()}</div>
              )}
            </div>
          )}
        </div>
      );
    });
  };

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
        {/* 画像表示箇所を変更 */}
        {product.ec_data?.images && <FlexibleImages images={product.ec_data.images} />}
        <div className="py-1 px-4">
          {product.name ? (
            <h2 className="text-[0.6875em] font-semibold mb-2">{product.name}</h2>
          ) : null}
          <PricePanel />
          {children}
        </div>
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={() => setModalOpen(false)} aria-label="閉じる">
              ×
            </button>
            <h2 className="text-xs font-semibold mb-2">{product.name}</h2>
            {product.description && (
              <p className="text-base text-gray-700 mb-3">{product.description}</p>
            )}
            <PricePanel />
            {renderEcData()}
            {/* 画像一覧を同様に表示 */}
            {product.ec_data?.images && (
              <div><FlexibleImages images={product.ec_data.images} /></div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;