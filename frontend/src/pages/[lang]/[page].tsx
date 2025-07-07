import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { PinGrid } from "@/f/components/PinGrid";
import { trackGAEvent } from "@/f/utils/track";
import { messages } from "@/f/config/messageConfig";
import { fetchWithTimeout } from "@/f/utils/fetchTimeout";

type Props = {
  lang: string;
  page: number;
  items: any[];
  t: {
    title: string;
    ogTitle: string;
    description: string;
    ogDescription: string;
  };
  fetchError?: string;
};

const limit = 30;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { params } = ctx;
  const apiUrl = process.env.PUBLIC_API_BASE_URL;
  const lang = typeof params?.lang === "string" ? params.lang : "ja";
  const page = Number(params?.page || 1);

  let allItems: any[] = [];
  let fetchError: string | undefined = undefined;

  // APIタイムアウト
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = fetchTimeout(`${apiUrl}/api/pins`,5000);
    if (res.status === 404) throw new Error("API returned 404");
    if (!res.ok) throw new Error(`Failed to fetch pins: ${res.status} ${res.statusText}`);
    allItems = await res.json();
  } catch (err: any) {
    fetchError = "データを取得できませんでした";
    allItems = []; // 空データ返却
  }

  const offset = (page - 1) * limit;
  const items = allItems.slice(offset, offset + limit);

  const safeString = (v: any) =>
    Array.isArray(v) ? v.join(" ") : v == null ? "" : String(v);

  // 多言語テキスト
  const tMsg = (messages.pageListPage as any)[lang] ?? {};
  const t = {
    title: safeString(typeof tMsg.title === "function" ? tMsg.title(page) : tMsg.title),
    ogTitle: safeString(typeof tMsg.ogTitle === "function" ? tMsg.ogTitle(page) : tMsg.ogTitle),
    description: safeString(typeof tMsg.description === "function" ? tMsg.description(page) : tMsg.description),
    ogDescription: safeString(tMsg.ogDescription),
  };

  return {
    props: {
      lang,
      page,
      items,
      t,
      fetchError,
    },
  };
};

const PageList = ({ lang, page, items, t, fetchError }: Props) => {
  const first = items?.[0];
  const ogImage = first?.imageUrl || "/default-og.jpg";
  const ogTitle = t.ogTitle;
  const ogDescription = t.ogDescription;

  useEffect(() => {
    trackGAEvent("scroll_page", { page: { page } });
  }, [page]);

  return (
    <>
      <Head>
        <title>{ogTitle}</title>
        <meta name="description" content={t.description} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://phis.jp/page/${page}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:image" content={ogImage} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": ogTitle,
              "mainEntity": items.map((p) => ({
                "@type": "Product",
                "name": p.title,
                "image": p.imageUrl,
                "url": `https://phis.jp/products/${p.id}`,
              })),
            }),
          }}
        />
      </Head>
      <main className="p-6">
        {fetchError && <div className="text-red-500">{fetchError}</div>}
        <h1 className="text-xl font-bold mb-4">{t.title}</h1>
        <PinGrid items={items} loadMore={() => {}} onSelect={() => {}} />
      </main>
    </>
  );
};

export default PageList;