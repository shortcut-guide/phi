import { useEffect, useRef, useState } from "react";
import ProductCard from "@/f/components/ProductCard";

const getColumnArray = (products, columnCount) => {
  // 各カラムごとに配列を作る
  return Array.from({ length: columnCount }, (_, colIdx) =>
    products.filter((_, prodIdx) => prodIdx % columnCount === colIdx)
  );
};

export const MasonryLayout = ({ products, onLoadMore, enableInfiniteScroll = false }) => {
  const containerRef = useRef(null);
  const loadRef = useRef<HTMLDivElement | null>(null);
  const [observerAttached, setObserverAttached] = useState(false);

  // レスポンシブにカラム数を決定
  const [columnCount, setColumnCount] = useState(2);
  useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth;
      if (width >= 1536) setColumnCount(6); // 2xl
      else if (width >= 1280) setColumnCount(5); // xl
      else if (width >= 1024) setColumnCount(4); // lg
      else if (width >= 768) setColumnCount(3); // md
      else setColumnCount(2); // 最小でも2カラム
    };
    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  useEffect(() => {
    if (!enableInfiniteScroll || observerAttached) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && onLoadMore) onLoadMore();
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

  const columns = getColumnArray(products, columnCount);

  return (
    <div
      className={
        "grid gap-1 " +
        (columnCount === 2
          ? "grid-cols-2"
          : columnCount === 3
          ? "grid-cols-3"
          : columnCount === 4
          ? "grid-cols-4"
          : columnCount === 5
          ? "grid-cols-5"
          : "grid-cols-6")
      }
      ref={containerRef}
    >
      {columns.map((col, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          {col.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ))}
      {enableInfiniteScroll && <div ref={loadRef} style={{ height: 1 }} />}
    </div>
  );
};