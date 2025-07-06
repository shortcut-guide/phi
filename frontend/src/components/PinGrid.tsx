// PinGrid.tsx
import { useEffect, useRef } from 'react';
import { trackGAEvent } from '@/f/utils/track';

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

export function PinGrid({ items, loadMore, onSelect }: Readonly<Props>) {
  const loadRef = useRef<HTMLDivElement | null>(null);
  const currentPage = Math.floor(items.length / 30); // 30件/ページで仮定

  // 無限スクロール＋GA
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

  // スクロールして中央寄せ
  useEffect(() => {
    requestAnimationFrame(() => scrollToCenter(0)); // 初回中央寄せ
  }, []);
  
  // 中央スクロール補助
  const scrollToCenter = (index: number) => {
    const el = document.querySelectorAll('[data-pin]')?.[index];
    if (el) {
      const rect = (el as HTMLElement).getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;
      window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  };

  // 商品クリック & 詳細パネル展開
  const handleClick = (item: Item) => {
    trackGAEvent("product_click", {
      item_id: item.id,
      item_name: item.title
    });

    trackGAEvent("product_expand", {
      item_id: item.id,
      expanded: true
    });

    onSelect(item);
  };

  return (
    <>
      <div className="columns-3 sm:columns-4 md:columns-5 lg:columns-6 xl:columns-7 gap-4 p-4">
        {items.map((item) => (
          <button key={item.id} data-pin type="button" className="mb-4 break-inside-avoid cursor-pointer w-full text-left bg-transparent border-none p-0" onClick={() => handleClick(item)} aria-label={`Select ${item.title}`}>
            <div className="block">
              <img src={item.imageUrl} alt={item.title} loading="lazy" className="w-full rounded-lg shadow-md" />
              <div className="mt-1 text-sm text-center text-gray-700">{item.title}</div>
            </div>
          </button>
        ))}
      </div>
      <div ref={loadRef} className="h-12" />
    </>
  );
}
