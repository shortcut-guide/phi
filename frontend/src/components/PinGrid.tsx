import { useEffect, useRef } from "react";

type Item = {
  id: string;
  title: string;
  imageUrl: string;
};

interface Props {
  items?: Item[];
  loadMore: () => void;
  onSelect: (item: Item) => void;
  enableInfiniteScroll?: boolean;
}

export function PinGrid({
  items = [],
  loadMore,
  onSelect,
  enableInfiniteScroll = false
}: Readonly<Props>) {
  const loadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enableInfiniteScroll) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );
    if (loadRef.current) {
      observer.observe(loadRef.current);
    }
    return () => {
      if (loadRef.current) {
        observer.unobserve(loadRef.current);
      }
    };
  }, [loadMore, enableInfiniteScroll]);

  return (
    <div className="pin-grid">
      {items.map((item) => (
        <div key={item.id} data-pin onClick={() => onSelect(item)}>
          <img src={item.imageUrl} alt={item.title} />
          <p>{item.title}</p>
        </div>
      ))}
      <div ref={loadRef} />
    </div>
  );
}