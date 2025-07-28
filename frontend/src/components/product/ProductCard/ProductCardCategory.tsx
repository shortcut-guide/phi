import React from "react";
import { labelize } from "@/f/utils/labelize";

type Props = {
  label: string;
  values: string[];
  dict: Record<string, string>;
};

const ProductCardCategory: React.FC<Props> = ({ label, values, dict }) => (
  <div className="bg-blue-50 rounded px-2 py-1 font-semibold flex flex-col min-w-0 max-w-full">
    <div className="text-[0.6875em] mb-1 break-keep">{dict[label] ?? labelize(label)}</div>
    <div className="flex flex-wrap gap-1">
      {values.map((cat, idx) => (
        <span key={idx} className="bg-blue-100 px-2 py-0.5 rounded-full text-[0.65rem]">
          {dict[cat] ?? cat}
        </span>
      ))}
    </div>
  </div>
);

export default ProductCardCategory;
