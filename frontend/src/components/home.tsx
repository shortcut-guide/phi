import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PinGrid } from '@/f/components/PinGrid';
import { ProductDetail } from '@/f/components/ProductDetail';
import { messages } from "@/f/config/messageConfig";
import { fetchWithTimeout } from "@/f/utils/fetchTimeout";
import { getParsePageInt } from "@/f/utils/getParsePageInt";
import DefaultLayout from "@/f/layouts/DefaultLayout";
import type { Pins } from "@/f/types/pins";

const Home = ({ lang }: { lang: string }) => {
  const initialPage = 1;
  const initialItems: any[] = [];
  const fetchError: string | undefined = undefined;

  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;

  
  const isPageRoute = router.query.page !== undefined;

  const [items, setItems] = useState<any[]>(initialItems);
  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [clientError, setClientError] = useState<string | undefined>(fetchError);
  const [selected, setSelected] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  const loadPage = async (p: number, overwrite = false) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const res = await fetchWithTimeout(`${apiUrl}/api/pins?offset=${(p - 1) * 30}`, 5000);
      if (!res.ok) {
        console.error("API fetch failed status:", res.status);
        setClientError(`Status: ${res.status}`);
        return;
      }
      const more = await res.json();
      if (overwrite) setItems(more);
      else setItems(prev => [...prev, ...more]);
      setCurrentPage(p);
    } catch (err: any) {
      console.error("API fetch failed:", err);
      setClientError(err.message || "データを取得できませんでした");
    }
  };

  const initializePage = () => {
    const initialPageFromURL = getParsePageInt();
    loadPage(initialPageFromURL, true).then(() => {
      if (initialPageFromURL > 1) {
        history.replaceState(
          { page: initialPageFromURL, items, scrollY: 0 },
          '',
          `/${lang}/page/${initialPageFromURL}`
        );
      }
    });

    requestAnimationFrame(() => {
      const el = document.querySelectorAll('[data-pin]')[0];
      if (el) {
        const rect = el.getBoundingClientRect();
        const centerY = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;
        window.scrollTo({ top: centerY, behavior: 'smooth' });
      }
    });

    for (let i = 1; i < initialPageFromURL; i++) loadPage(i, false);

    const popHandler = (e: any) => {
      const state = e.state;
      if (state?.items) {
        setItems(state.items);
        setCurrentPage(state.page);
        setTimeout(() => window.scrollTo(0, state.scrollY ?? 0), 0);
      } else {
        const p = getParsePageInt();
        setItems([]);
        for (let j = 1; j <= p; j++) { loadPage(j); }
      }
    };
    window.addEventListener('popstate', popHandler);
    return () => window.removeEventListener('popstate', popHandler);
  };

  useEffect(() => {
    const { page: queryPage } = router.query;
    if (queryPage) return initializePage();
  }, [router.query.page]);

  const loadMoreHandler = clientError || !isPageRoute
    ? () => {}
    : async () => {
        const next = currentPage + 1;
        await loadPage(next);
        history.replaceState(
          { page: next, items, scrollY: window.scrollY },
          '',
          `/${lang}/page/${next}`
        );
      };

  const handleSelect = (item: any) => {
    setSelected(item);
    setExpanded(false);
  };

  const t = (messages.index as any)[lang] ?? {};
  return (
    <DefaultLayout lang={lang} title={t.title}>
      <div className="w-full h-screen flex flex-col overflow-hidden">
        <div className={`transition-all duration-300 ${expanded ? 'h-0' : 'h-2/3'} overflow-y-auto`}>
          <PinGrid
            items={items}
            loadMore={loadMoreHandler}
            onSelect={handleSelect}
            enableInfiniteScroll={isPageRoute && !clientError}
          />
        </div>
        <div className={`transition-all duration-300 bg-white shadow-md ${expanded ? 'h-full' : 'h-1/3'} overflow-y-auto`}>
          <ProductDetail
            product={selected}
            onExpand={() => setExpanded(true)}
            onClose={() => setSelected(null)}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Home;