// PinGrid.tsx
import { useEffect, useRef } from 'react';
import { trackGAEvent } from '@/f/utils/trackGA';

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
  const currentPage = Math.floor(items.length / 30); // 30件/ページで仮定

  useEffect(() => {
    if (!loadRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        trackGAEvent("scroll_page_load", { page_number: currentPage + 1 }); // 次ページ読み込み時
        loadMore();
      }
    });
    observer.observe(loadRef.current);
    return () => observer.disconnect();
  }, [loadRef.current, currentPage]);

  const scrollToCenter = (index: number) => {
  const el = document.querySelectorAll('[data-pin]')?.[index];
    if (el) {
      const rect = (el as HTMLElement).getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;
      window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    requestAnimationFrame(() => scrollToCenter(0)); // 初回中央寄せ
  }, []);

  return (
    <>
      <div className="columns-3 sm:columns-4 md:columns-5 lg:columns-6 xl:columns-7 gap-4 p-4">
        {items.map((item) => (
          <button
            key={item.id}
            data-pin
            type="button"
            className="mb-4 break-inside-avoid cursor-pointer w-full text-left bg-transparent border-none p-0"
            onClick={() => onSelect(item)}
            aria-label={`Select ${item.title}`}
          >
            <a href={`/products/${item.id}`} className="block">
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full rounded-lg shadow-md"
              />
              <div className="mt-1 text-sm text-center text-gray-700">{item.title}</div>
            </a>
          </button>
        ))}
      </div>
      <div ref={loadRef} className="h-12" />
    </>
  );
}
