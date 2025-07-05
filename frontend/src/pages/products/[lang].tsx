import { GetServerSideProps } from "next";
import DefaultLayout from '@/f/layouts/DefaultLayout';
import { ProductCard } from '@/f/components/ProductCard';
import type { Product } from '@/f/types/product';
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
  products: Product[];
};

const ProductsPage = ({ lang, products }: Props) => {
  const t = (messages.products as any)[lang] ?? {};

  return (
    <DefaultLayout title={t.title}>
      <main className="max-w-3xl mx-auto px-4 py-12 text-neutral-800">
        <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product: Product) => (
              <ProductCard key={product.id} {...product} lang={lang} />
            ))
          ) : (
            <p>商品の読込失敗</p>
          )}
        </div>
      </main>
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = typeof context.params?.lang === "string" ? context.params.lang : "ja";
  const apiUrl = process.env.PUBLIC_API_BASE_URL || "";
  let products: Product[] = [];

  try {
    const res = await fetch(`${apiUrl}/api/products`);
    if (!res.ok) {
      throw new Error(`APIエラー: ${res.status}`);
    }
    products = await res.json();
  } catch (err) {
    console.error("🔥 API fetch 失敗:", err);
  }

  return {
    props: {
      lang,
      products,
    },
  };
};

export default ProductsPage;
