import React, { useState, useMemo } from "react";
import { StarIcon } from "@/f/components/icons/StarIcon";
import { ReviewLinkIcon } from "@/f/components/icons/ReviewLinkIcon";
import FlexibleImages from "@/f/components/FlexibleImages";
import DescriptionBlock from "@/f/components/DescriptionBlock";
import TabbedSpec from "@/f/components/TabbedSpec";
import GenericSpec from "@/f/components/GenericSpec";
import PricePanel from "@/f/components/PricePanel";
import { labelize } from "@/f/utils/labelize";
import { messages } from "@/f/config/messageConfig";
import type { Product } from "@/f/types/product";

type ProductCardProps = {
  product: Product;
  onClick?: (product: Product) => void;
  className?: string;
  children?: React.ReactNode;
  lang: string;
  t?: any;
} & React.HTMLAttributes<HTMLDivElement>;

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  className = "",
  children,
  lang,
  ...rest
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const dict = messages.productSpec?.[lang] ?? {};
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

          {typeof ecData.review_rate === "number" && typeof ecData.review_count === "number" && (
            <div className="flex items-center justify-left text-[0.625em] text-gray-500 mb-1">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => {
                  const isFilled = i < Math.floor(ecData.review_rate);
                  return <StarIcon key={i} filled={isFilled} />;
                })}
                <span className="ml-1">({ecData.review_count.toLocaleString()})</span>
              </div>
              {ecData.review_link && (
                <a
                  href={
                    ecData.review_link.startsWith("http")
                      ? ecData.review_link
                      : `${ecData.url}${ecData.review_link}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 ml-2"
                  aria-label="レビューを見る"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ReviewLinkIcon />
                </a>
              )}
            </div>
          )}

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
                  {product.name}
                </h2>
              )}
              {typeof ecData.review_rate === "number" && typeof ecData.review_count === "number" && (
                <div className="flex items-center justify-left text-[0.6875em] text-gray-500 mb-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const isFilled = i < Math.floor(ecData.review_rate);
                      return <StarIcon key={i} filled={isFilled} />;
                    })}
                    <span className="ml-1">({ecData.review_count.toLocaleString()})</span>
                  </div>
                  {ecData.review_link && (
                    <a
                      href={
                        ecData.review_link.startsWith("http")
                          ? ecData.review_link
                          : `${ecData.url}${ecData.review_link}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 ml-2"
                      aria-label="レビューを見る"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ReviewLinkIcon />
                    </a>
                  )}
                </div>
              )}
              <div className="mb-2 text-center">
                <PricePanel product={product} />
              </div>
              <DescriptionBlock text={product.description} />
              <DescriptionBlock text={ecData.description} />
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
                        <div
                          key={key}
                          className="bg-blue-50 rounded px-2 py-1 text-xs text-blue-700 font-semibold flex flex-col min-w-0 max-w-full"
                        >
                          <div className="text-blue-500 mb-1 break-keep">
                            {dict[key] ?? labelize(key)}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {value.map((cat: string, idx: number) => (
                              <span
                                key={idx}
                                className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[0.65rem]"
                              >
                                {dict[cat] ?? cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    } else if (
                      key === "url" ||
                      (key === "review_link" && typeof value === "string")
                    ) {
                      return null;
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
