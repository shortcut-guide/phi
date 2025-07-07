import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { PinGrid } from '@/f/components/PinGrid';
import { ProductDetail } from '@/f/components/ProductDetail';
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const Home =({ lang }: Props) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const t = (messages.index as any)[lang] ?? {};
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const loadPage = async (p: number, overwrite = false) => {
    const res = await fetch(`/api/pins?offset=${(p - 1) * 30}`);
    const more = await res.json();

    if (overwrite) setItems(more);
    else setItems(prev => [...prev, ...more]);

    setPage(p);
    history.replaceState({ page: p, items, scrollY: 0 }, '', `/page/${p}`);
  };

  const getInitialPageFromPath = () => {
    const regex = /^\/page\/(\d+)/;
    const match = regex.exec(location.pathname);
    return match ? parseInt(match[1], 10) : 1;
  };

  const loadInitial = async () => {
    const initialPage = getInitialPageFromPath();
    await loadPage(initialPage, true);
    requestAnimationFrame(() => {
      const el = document.querySelectorAll('[data-pin]')[0];
      if (el) {
        const rect = el.getBoundingClientRect();
        const centerY = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;
        window.scrollTo({ top: centerY, behavior: 'smooth' });
      }
    });
    for (let i = 1; i < initialPage; i++) loadPage(i, false);
  };

  useEffect(() => {
    loadInitial();
    const popHandler = (e: any) => {
      const state = e.state;
      if (state?.items) {
        setItems(state.items);
        setPage(state.page);
        setTimeout(() => window.scrollTo(0, state.scrollY ?? 0), 0);
      } else {
        const pageFromURL = getInitialPageFromPath();
        setItems([]);
        for (let i = 1; i <= pageFromURL; i++) loadPage(i);
      }
    };
    window.addEventListener('popstate', popHandler);
    return () => window.removeEventListener('popstate', popHandler);
  }, []);

  const handleSelect = (item: any) => {
    setSelected(item);
    setExpanded(false);
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <div className={`transition-all duration-300 ${expanded ? 'h-0' : 'h-2/3'} overflow-y-auto`}>
        <PinGrid items={items} loadMore={() => loadPage(page + 1)} onSelect={handleSelect} />
      </div>
      <div className={`transition-all duration-300 bg-white shadow-md ${expanded ? 'h-full' : 'h-1/3'} overflow-y-auto`}>
        <ProductDetail
          product={selected}
          onExpand={() => setExpanded(true)}
          onClose={() => setSelected(null)}
        />
      </div>
    </div>
  );
}

export default Home;