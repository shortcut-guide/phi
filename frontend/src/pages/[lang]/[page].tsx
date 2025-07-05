import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { PinGrid } from "@/f/components/PinGrid";
import { trackGAEvent } from "@/f/utils/track";
import { messages } from "@/f/config/messageConfig";

// SSGで生成するページ（多言語＆ページネーション）
export const getStaticPaths: GetStaticPaths = async () => {
  const limit = 30;
  const apiUrl = process.env.PUBLIC_API_BASE_URL;
  const langs = Object.keys(messages.pageListPage);

  let allItems: any[] = [];
  try {
    const res = await fetch(`${apiUrl}/api/pins`);
    if (res.status === 404) throw new Error("API returned 404");
    if (!res.ok) throw new Error(`Failed to fetch pins: ${res.status} ${res.statusText}`);
    allItems = await res.json();
  } catch (err) {
    console.error("🔥 API fetch 失敗:", err);
  }

  // 取得失敗時は各言語1ページ分空リスト
  if (!allItems.length) {
    return {
      paths: langs.map(lang => ({
        params: { lang, page: "1" }
      })),
      fallback: false,
    };
  }

  // 多言語×ページネーションでpaths作成
  const paths: { params: { lang: string; page: string } }[] = [];
  for (const lang of langs) {
    const totalPages = Math.ceil(allItems.length / limit);
    for (let i = 0; i < totalPages; i++) {
      paths.push({ params: { lang, page: String(i + 1) } });
    }
  }
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const limit = 30;
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

  return {
    props: {
      lang,
      page,
      items,
    },
  };
};

type Props = {
  lang: string;
  page: number;
  items: any[];
};

const PageList = ({ lang, page, items }: Props) => {
  const t = (messages.pageListPage as any)[lang] ?? {
    title: (page: number) => "",
    ogTitle: (page: number) => "",
    description: (page: number) => "",
    ogDescription: "",
  };
  const first = items?.[0];
  const ogImage = first?.imageUrl || "/default-og.jpg";
  const ogTitle = t.ogTitle(page);
  const ogDescription = t.ogDescription;

  // ページビュートラッキング（初回のみ）
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
