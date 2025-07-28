import React, { useState, useEffect } from "react";
import { FlexibleImages } from "@/f/components/product/FlexibleImages";
import { DescriptionBlock } from "@/f/components/product/DescriptionBlock";
import { PricePanel } from "@/f/components/product/PricePanel";
import ProductCardReview from "@/f/components/product/ProductCard/ProductCardReview";
import ProductCardSpecGrid from "@/f/components/product/ProductCard/ProductCardSpecGrid";
import PricePanelModal from "@/f/components/product/PricePanel/PricePanelModal";
import { useTabbedKeys } from "@/f/components/product/TabbedSpec/useTabbedKeys";
import { useActiveTabs } from "@/f/components/product/TabbedSpec/useActiveTabs";
import { toAffiliateLink } from "@/f/utils/affiliateLink";
import { messages } from "@/f/config/messageConfig";
import type { ProductCardProps } from "./ProductCard.types";

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  className = "",
  children,
  lang,
  ...rest
}) => {
  const [affiliateUrl, setAffiliateUrl] = useState(product.ec_data.url);
  const [modalOpen, setModalOpen] = useState(false);
  const productSpec = messages.productSpec?.[lang] ?? {};
  const ecData = product.ec_data || {};
  const tabbedKeys = useTabbedKeys(ecData);
  const [activeTabs, setActiveTabs] = useActiveTabs(tabbedKeys, ecData);

  useEffect(() => {
    let isCancelled = false;
    toAffiliateLink(product.shopUrl).then((convertedUrl) => {
      if (!isCancelled) setAffiliateUrl(convertedUrl);
    });
    return () => {
      isCancelled = true;
    };
  }, [product.shopUrl]);

  return (
    <>
      <div
        className={
          "bg-white rounded-2xl shadow-md overflow-hidden max-w-xs my-1 transform transition-transform hover:scale-[1.02] cursor-pointer " +
          className
        }
        onClick={() => {
          setModalOpen(true);
          onClick?.(product);
        }}
        {...rest}
      >
        {/* FlexibleImages部分をdivでラップしクリック伝播を停止 */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative"
        >
          {ecData.product.images && <FlexibleImages images={ecData.product.images} />}
        </div>
        <div className="py-0 pl-3 pr-1">
          {product.name && (
            <h2 className="text-[0.6875em] font-semibold mb-1 line-clamp-2 leading-tight">
              <a href={affiliateUrl} target="_blank" rel="noopener noreferrer">
                {product.name}
              </a>
            </h2>
          )}
          <ProductCardReview
            rate={ecData.review_rate}
            count={ecData.review_count}
            reviewLink={ecData.review_link}
            url={ecData.url}
            lang={lang}
          />
          {typeof product.point === "number" && (
            <div className="text-[0.625em] font-medium mb-1">
              {product.point.toLocaleString()} pt
            </div>
          )}
          {(() => {
            const findBasePrice = () => {
              const groups = [
                ecData.size,
                ecData.product?.size,
                ecData.product?.color,
                ecData.product
              ];
              for (const group of groups) {
                if (group && typeof group === "object") {
                  for (const key in group) {
                    const entry = group[key];
                    if (
                      entry &&
                      typeof entry === "object" &&
                      "price" in entry &&
                      typeof entry.price !== "undefined" &&
                      Number(entry.price) === Number(product.price)
                    ) {
                      return entry.base_price;
                    }
                  }
                }
              }
              return undefined;
            };
            const basePrice = findBasePrice();
            return (
              <div className="flex items-center justify-between">
                <PricePanel product={{ ...product, base_price: basePrice }} />
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center mb-1 mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalOpen(true);
                  }}
                  aria-label="商品詳細を表示"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="4 4 16 16"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-6 h-6"
                    aria-hidden="true"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 17 L17 17 L17 13"
                    />
                  </svg>
                </button>
              </div>
            );
          })()}
          {children}
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-0">
            <div className="relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10"
                onClick={() => setModalOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
              {ecData.product.images && (
                <div className="flex justify-center items-center bg-gray-100 rounded-t-xl p-4">
                  <FlexibleImages images={ecData.product.images} />
                </div>
              )}
            </div>
            <div className="p-6">
              {product.name && (
                <h2 className="text-[0.6875em] font-bold text-left mb-1">
                  <a href={affiliateUrl} target="_blank" rel="noopener noreferrer">
                    {product.name}
                  </a>
                </h2>
              )}
              <ProductCardReview
                rate={ecData.product.review_rate}
                count={ecData.product.review_count}
                reviewLink={ecData.product.review_link}
                url={ecData.product.url}
                lang={lang}
                className="mb-2 text-[0.6875em]"
              />
              <div className="mb-2 text-center">
                {(() => {
                  const findBasePrice = () => {
                    const groups = [
                      ecData.size,
                      ecData.product?.size,
                      ecData.product?.color,
                      ecData.product
                    ];
                    for (const group of groups) {
                      if (!group && typeof group !== "object") continue;
                      for (const key in group) {
                        const entry = group[key];
                        if (
                          entry &&
                          typeof entry === "object" &&
                          "price" in entry &&
                          typeof entry.price !== "undefined" &&
                          Number(entry.price) === Number(product.price)
                        ) {
                          return entry.base_price;
                        }
                      }
                    }
                    return undefined;
                  };
                  const basePrice = findBasePrice();
                  return <PricePanelModal product={{ ...product, base_price: basePrice }} />;
                })()}
              </div>
              <DescriptionBlock text={product.description} />
              <DescriptionBlock text={ecData.description} />
              <ProductCardSpecGrid
                ecData={ecData}
                tabbedKeys={tabbedKeys}
                activeTabs={activeTabs}
                setActiveTabs={setActiveTabs}
                dict={productSpec}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;