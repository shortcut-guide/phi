import { useEffect, useRef, useState } from "react";
import ProductCard from "@/f/components/ProductCard";

export const MasonryLayout = ({ products, onLoadMore, enableInfiniteScroll = false }) => {
  const col1 = products.filter((_, index) => index % 2 === 0);
  const col2 = products.filter((_, index) => index % 2 === 1);

  // 親コラムのref
  const containerRef = useRef(null);

  // observer用
  const loadRef = useRef<HTMLDivElement | null>(null);
  const [observerAttached, setObserverAttached] = useState(false);

  useEffect(() => {
    if (!enableInfiniteScroll || observerAttached) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && onLoadMore) {
          onLoadMore();
        }
      },
      { rootMargin: "200px" }
    );
    if (loadRef.current) {
      observer.observe(loadRef.current);
      setObserverAttached(true);
    }
    return () => {
      if (loadRef.current) observer.unobserve(loadRef.current);
    };
  }, [enableInfiniteScroll, onLoadMore, observerAttached]);

  // スクロールイベント
  const handleCenterScroll = (e) => {
    if (containerRef.current) {
      containerRef.current.scrollTop += e.deltaY;
    }
  };

  return (
    <div
      className="grid grid-cols-2 gap-1 h-[100vh] overflow-hidden"
      ref={containerRef}
    >
      {/* 左カラム */}
      <div className="px-1 h-full" onWheel={handleCenterScroll} style={{ pointerEvents: "auto" }}>
        {col1.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* 右カラム */}
      <div className="px-1 h-full" onWheel={handleCenterScroll} style={{ pointerEvents: "auto" }}>
        {col2.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* IntersectionObserver */}
      {enableInfiniteScroll && <div ref={loadRef} style={{ height: 1 }} />}
    </div>
  );
};