// src/pages/[lang]/page/[page].tsx

import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { PinGrid } from "@/f/components/PinGrid";
import { trackGAEvent } from "@/f/utils/track";
import { messages } from "@/f/config/messageConfig";
import { fetchWithTimeout } from "@/f/utils/fetchTimeout";
import type { Pins } from "@/f/types/pins";

const limit = 30;

export const getServerSideProps: GetServerSideProps<Pins> = async (ctx) => {
  console.log("SSR: [page].tsx", ctx.req?.url, ctx.params);

  // APIパスをSSRが処理しないようガード
  if (ctx.req?.url?.startsWith("/api/")) {
    return { notFound: true };
  }

  const { params } = ctx;
  const lang = typeof params?.lang === "string" ? params.lang : "ja";
  const pageRaw = params?.page;
  const page = Number(pageRaw);

  // ★「pageが数値でない場合」は404を返す
  if (!pageRaw || isNaN(page) || page < 1) {
    return { notFound: true };
  }

  // 以下は今まで通り
  let allItems: any[] = [];
  let fetchError: string | undefined = undefined;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    const res = await fetchWithTimeout(`${apiUrl}/api/pins`, 5000);
    if (!res.ok) {
      fetchError = "データを取得できませんでした";
    } else {
      allItems = await res.json();
    }
  } catch {
    fetchError = "データを取得できませんでした";
  }

  const offset = (page - 1) * limit;
  const items = allItems.slice(offset, offset + limit);

  const safeString = (v: any) =>
    Array.isArray(v) ? v.join(" ") : v == null ? "" : String(v);

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

const PageList = ({ lang, page, items = [], t, fetchError }: Pins & { t: any }) => {
  const first = items[0];
  const ogImage = first?.imageUrl || "/default-og.jpg";
  const ogTitle = t.ogTitle;
  const ogDescription = t.ogDescription;

  useEffect(() => {
    trackGAEvent("scroll_page", { page });
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
        <meta property="og:url" content={`https://phi.jp/${lang}/page/${page}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:image" content={ogImage} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: ogTitle,
              mainEntity: items.map((p) => ({
                "@type": "Product",
                name: p.title,
                image: p.imageUrl,
                url: `https://phi.jp/products/${p.id}`,
              })),
            }),
          }}
        />
      </Head>
      <main className="p-6">
        {fetchError && <div className="text-red-500">{fetchError}</div>}
        <h1 className="text-xl font-bold mb-4">{t.title}</h1>
        <PinGrid items={items} loadMore={() => {}} onSelect={() => {}} enableInfiniteScroll={true} />
      </main>
    </>
  );
};

export default PageList;