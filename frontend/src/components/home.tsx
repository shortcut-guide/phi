import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { messages } from "@/f/config/messageConfig";
import { fetchWithTimeout } from "@/f/utils/fetchTimeout";
import { getParsePageInt } from "@/f/utils/getParsePageInt";
import DefaultLayout from "@/f/layouts/DefaultLayout";
import { MasonryLayout } from "@/f/components/MasonryLayout";
import fallbackProducts from '@/d/products.json';

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

  const fetchFallbackProducts = async () => {
    return Array.isArray(fallbackProducts) ? fallbackProducts : [];
  };

  const loadPage = async (p: number, overwrite = false) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const res = await fetchWithTimeout(`${apiUrl}/api/products`, 5000);
      let more;
      if (!res.ok) {
        setClientError(`Status: ${res.status}`);
        more = [];
      } else {
        more = await res.json();
      }
      // APIから何も取れなかった場合ローカルJSONを読む
      if (!more || !Array.isArray(more) || more.length === 0) {
        more = await fetchFallbackProducts();
      }
      if (overwrite) setItems(more);
      else setItems(prev => [...prev, ...more]);
      setCurrentPage(p);
    } catch (err: any) {
      const fallback = await fetchFallbackProducts();
      setItems(fallback);
      setClientError(err.message || "データを取得できませんでした");
    }
  };

  useEffect(() => {
    const { page: queryPage } = router.query;
    const initialPageFromURL = getParsePageInt();
    loadPage(initialPageFromURL, true);
  }, [router.query.page]);

  const t = (messages.index as any)[lang] ?? {};
  return (
    <DefaultLayout lang={lang} title={t.title}>
      <div className="w-full h-screen flex flex-col overflow-hidden p-4">
        <MasonryLayout
          products={items}
          onLoadMore={() => {}}
          enableInfiniteScroll={true}
        />
      </div>
    </DefaultLayout>
  );
};

export default Home;