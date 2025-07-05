import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { PinGrid } from "@/f/components/PinGrid";
import { trackGAEvent } from "@/f/utils/track";
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
  page: number;
  items: any[];
  t: any;
};

const limit = 30;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { params, req } = ctx;
  const apiUrl = process.env.PUBLIC_API_BASE_URL;
  const lang = typeof params?.lang === "string" ? params.lang : "ja";
  const page = Number(params?.page || 1);

  let allItems: any[] = [];
  try {
    const res = await fetch(`${apiUrl}/api/pins`);
    if (res.status === 404) throw new Error("API returned 404");
    if (!res.ok) throw new Error(`Failed to fetch pins: ${res.status} ${res.statusText}`);
    allItems = await res.json();
  } catch (err) {
    console.error("🔥 API fetch 失敗:", err);
  }

  const offset = (page - 1) * limit;
  const items = allItems.slice(offset, offset + limit);

  // 多言語テキスト
  const t = (messages.pageListPage as any)[lang] ?? {
    title: (page: number) => "",
    ogTitle: (page: number) => "",
    description: (page: number) => "",
    ogDescription: "",
  };

  return {
    props: {
      lang,
      page,
      items,
      t,
    },
  };
};

const PageList = ({ lang, page, items, t }: Props) => {
  const first = items?.[0];
  const ogImage = first?.imageUrl || "/default-og.jpg";
  const ogTitle = t.ogTitle(page);
  const ogDescription = t.ogDescription;

  useEffect(() => {
    trackGAEvent("scroll_page", { page: { page } });
  }, [page]);

  return (
    <>
      <Head>
        <title>{ogTitle}</title>
        <meta name="description" content={t.description(page)} />
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
              "name": t.ogTitle(page),
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
        <h1 className="text-xl font-bold mb-4">{t.title(page)}</h1>
        <PinGrid items={items} loadMore={() => {}} onSelect={() => {}} />
      </main>
    </>
  );
};

export default PageList;