// PinGrid.tsx
import { useEffect, useRef } from 'react';

interface Item {
  id: string;
  imageUrl: string;
  title: string;
}

interface Props {
  items: Item[];
  loadMore: () => void;
  onSelect: (item: Item) => void;
}

export function PinGrid({ items, loadMore, onSelect }: Props) {
  const loadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    });
    observer.observe(loadRef.current);
    return () => observer.disconnect();
  }, [loadRef.current]);

  return (
    <>
      <div className="columns-3 sm:columns-4 md:columns-5 lg:columns-6 xl:columns-7 gap-4 p-4">
        {items.map((item) => (
          <div key={item.id} data-pin className="mb-4 break-inside-avoid cursor-pointer" onClick={() => onSelect(item)}>
            <img
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              className="w-full rounded-lg shadow-md"
            />
            <div className="mt-1 text-sm text-center text-gray-700">{item.title}</div>
          </div>
        ))}
      </div>
      <div ref={loadRef} className="h-12" />
    </>
  );
}
