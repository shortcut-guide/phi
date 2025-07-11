import { useRef } from "react";
import ProductCard from "@/f/components/ProductCard";

export const MasonryLayout = ({ products }) => {
  const featured = products.filter((_, index) => index % 3 === 0);
  const popular = products.filter((_, index) => index % 3 === 1);
  const recent = products.filter((_, index) => index % 3 === 2);

  // 親・中央コラムのref
  const containerRef = useRef(null);
  const centerColumnRef = useRef(null);

  // 中央でスクロールしたら、全体をスクロールさせる
  const handleCenterScroll = (e) => {
    if (containerRef.current) {
      containerRef.current.scrollTop += e.deltaY;
      e.preventDefault();
    }
  };

  return (
    <div
      className="grid grid-cols-3 gap-4 h-[80vh] overflow-hidden"
      ref={containerRef}
    >
      {/* 左カラム: 独立スクロール */}
      <div className="overflow-y-auto h-full">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* 中央カラム: スクロールで親を動かす */}
      <div
        ref={centerColumnRef}
        className="overflow-y-auto h-full"
        onWheel={handleCenterScroll}
        // pointer-events-autoでイベント拾える
        style={{ pointerEvents: "auto" }}
      >
        {popular.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* 右カラム: 独立スクロール */}
      <div className="overflow-y-auto h-full">
        {recent.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
