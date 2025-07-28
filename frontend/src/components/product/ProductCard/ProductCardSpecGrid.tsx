import React from "react";
import TabbedSpec from "@/f/components/product/TabbedSpec/TabbedSpec";
import { GenericSpec } from "@/f/components/product/GenericSpec";
import ProductCardCategory from "@/f/components/product/ProductCard/ProductCardCategory";
import { labelize } from "@/f/utils/labelize";

type Props = {
  ecData: Record<string, any>;
  tabbedKeys: string[];
  activeTabs: Record<string, string>;
  setActiveTabs: (fn: (prev: Record<string, string>) => Record<string, string>) => void;
  dict: Record<string, string>;
};

const ProductCardSpecGrid: React.FC<Props> = ({
  ecData,
  tabbedKeys,
  activeTabs,
  setActiveTabs,
  dict,
}) => (
  <div className="mb-2 grid grid-cols-2 gap-2">
    {Object.entries(ecData.product)
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
        }
        if (key === "category" && Array.isArray(value)) {
          return <ProductCardCategory key={key} label={key} values={value} dict={dict} />;
        }
        if (key === "url" || (key === "review_link" && typeof value === "string")) {
          return null;
        }
        return <GenericSpec key={key} label={key} value={value} dict={dict} />;
      })}
  </div>
);

export default ProductCardSpecGrid;
