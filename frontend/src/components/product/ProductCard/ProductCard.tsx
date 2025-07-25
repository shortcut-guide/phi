import React, { useState, useEffect } from "react";
import { FlexibleImages } from "@/f/components/product/FlexibleImages";
import { DescriptionBlock } from "@/f/components/product/DescriptionBlock";
import { PricePanel } from "@/f/components/product/PricePanel";
import ProductCardReview from "@/f/components/product/ProductCard/ProductCardReview";
import ProductCardSpecGrid from "@/f/components/product/ProductCard/ProductCardSpecGrid";
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
  const dict = messages.productSpec?.[lang] ?? {};
  const ecData = product.ec_data || {};
  const tabbedKeys = useTabbedKeys(ecData);
  const [activeTabs, setActiveTabs] = useActiveTabs(tabbedKeys, ecData);

  useEffect(() => {
    let isCancelled = false;

    // 非同期でアフィリエイトリンクを取得
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
        {ecData.images && <FlexibleImages images={ecData.images} />}
        <div className="py-1 px-4">
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
          />
          {typeof product.point === "number" && (
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
            <div className="relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10"
                onClick={() => setModalOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
              {ecData.images && (
                <div className="flex justify-center items-center bg-gray-100 rounded-t-xl p-4">
                  <FlexibleImages images={ecData.images} />
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
                rate={ecData.review_rate}
                count={ecData.review_count}
                reviewLink={ecData.review_link}
                url={ecData.url}
                className="mb-2 text-[0.6875em]"
              />
              <div className="mb-2 text-center">
                <PricePanel product={product} />
              </div>
              <DescriptionBlock text={product.description} />
              <DescriptionBlock text={ecData.description} />
              <ProductCardSpecGrid
                ecData={ecData}
                tabbedKeys={tabbedKeys}
                activeTabs={activeTabs}
                setActiveTabs={setActiveTabs}
                dict={dict}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
