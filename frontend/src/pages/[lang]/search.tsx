import DefaultLayout from "@/f/layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import fallbackProducts from "@/d/products.json";
import { MasonryLayout } from "@/f/components/MasonryLayout";
import { messages } from "@/f/config/messageConfig";


const SearchPage = () => {
  const router = useRouter();
  const { lang } = router.query;
  const t = (messages.search as any)[lang as string] ?? {};

  const [keyword, setKeyword] = useState("");
  // カテゴリは階層配列（例: [["ペット用品", "犬", "服・アクセサリ", "レインコート・ライフジャケット"], ...]）
  const [categories, setCategories] = useState<string[][]>([]);
  const [popularWords, setPopularWords] = useState<string[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    // カテゴリ一覧取得（API失敗時は products.json を利用）
    axios.get(`/api/search/categories`)
      .then(res => setCategories(res.data))
      .catch(() => {
        if (Array.isArray(fallbackProducts)) {
          const allPaths = fallbackProducts
            .map((p: any) => p.ec_data?.category)
            .filter((c: any): c is string[] => Array.isArray(c));

          // カテゴリパスを文字列でユニーク化 → 再分割して配列に戻す
          const uniquePaths = Array.from(
            new Set(allPaths.map(path => path.join(">>")))
          ).map(str => str.split(">>"));

          setCategories(uniquePaths);
        }
      });

    // 人気検索ワード取得
    axios.get(`/api/search/popular`).then(res => setPopularWords(res.data));

    // 注目商品取得
    axios.get(`/api/products/featured`).then(res => setFeaturedProducts(res.data));

    // 検索履歴取得
    const local = localStorage.getItem("search_history");
    if (local) setHistory(JSON.parse(local));
  }, []);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const handleSearch = () => {
    if (!keyword.trim()) return;

    const updatedHistory = [keyword, ...history.filter(h => h !== keyword)].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem("search_history", JSON.stringify(updatedHistory));

    const lower = keyword.toLowerCase();

    const results = fallbackProducts.filter((p) => {
      const ec: Record<string, any> = p.ec_data || {};
      const name = p.name?.toLowerCase() || "";
      const id = p.id?.toLowerCase() || "";
      const desc = ec.description?.toLowerCase() || "";
      const platform = p.platform?.toLowerCase() || "";
      const shipping = ec.shipping_from?.toLowerCase() || "";

      const categoryHit = Array.isArray(ec.category) && ec.category.some((c: string) => c.toLowerCase().includes(lower));
      const colorHit = ec.images?.color && Object.keys(ec.images.color).some(c => c.toLowerCase().includes(lower));
      const sizeHit = ec.size && Object.keys(ec.size).some(s => s.toLowerCase().includes(lower));
      const priceHit = ec.size && Object.values(ec.size).some((sz: any) =>
        String(sz?.base_price || "").includes(lower) || String(sz?.price || "").includes(lower)
      );

      return (
        name.includes(lower) ||
        id.includes(lower) ||
        desc.includes(lower) ||
        platform.includes(lower) ||
        shipping.includes(lower) ||
        categoryHit ||
        colorHit ||
        sizeHit ||
        priceHit
      );
    });

    setSearchResults(results);
  };

  // カテゴリの木構造を構築する関数
  const buildCategoryTree = (flatCategories: string[][]) => {
    // カテゴリ名の正規化（前後トリム＋全角→半角）
    const normalize = (s: string) => s.normalize("NFKC").trim();

    // パスごとに正規化して重複排除
    const uniquePaths = Array.from(
      new Set(
        flatCategories.map(path => path.map(normalize).join(">>"))
      )
    ).map(s => s.split(">>"));

    // パスをマージして木構造を構築
    const root: Record<string, any> = {};
    for (const path of uniquePaths) {
      let current = root;
      for (const part of path) {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    }

    // 再帰的にツリー配列へ
    const convertToTreeArray = (node: Record<string, any>): any[] =>
      Object.entries(node).map(([label, children]) => ({
        label,
        children: convertToTreeArray(children),
      }));

    return convertToTreeArray(root);
  };

  // 折りたたみ式カテゴリツリーパネル
  const CategoryTree = ({
    nodes,
    onSelect,
    path = [],
  }: {
    nodes: { label: string; children: any[] }[];
    onSelect: (path: string[]) => void;
    path?: string[];
  }) => {
    const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

    const toggleOpen = (key: string) => {
      setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <ul className="pl-2 border rounded bg-white shadow-sm divide-y divide-gray-100">
        {nodes.map((node) => {
          const currentPath = [...path, node.label];
          const key = currentPath.join(">");
          const isOpen = openMap[key];
          return (
            <li key={key} className="px-3 py-2 hover:bg-gray-50 transition-all">
              <div className="flex items-center justify-between">
                <button
                  className="text-sm text-left text-blue-700 underline font-medium hover:opacity-80"
                  onClick={() => onSelect(currentPath)}
                >
                  {node.label}
                </button>
                {node.children.length > 0 && (
                  <button
                    onClick={() => toggleOpen(key)}
                    className="ml-2 text-gray-600 border border-gray-300 rounded w-6 h-6 flex items-center justify-center hover:bg-gray-100 transition"
                    aria-label={t.toggle}
                  >
                    {isOpen ? "↓" : "→"}
                  </button>
                )}
              </div>
              {isOpen && node.children.length > 0 && (
                <div className="pl-4 pt-2">
                  <CategoryTree nodes={node.children} onSelect={onSelect} path={currentPath} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  // 柔軟な画像構造対応: FlexibleImagesのロジックを踏襲
  const getProductImage = (p: any): string | null => {
    try {
      const images = p.ec_data?.images;
      if (!images) {
        if (typeof p.image === "string" && p.image.trim()) {
          return encodeURI(p.image.trim());
        }
        console.warn(t.FailedLoadImage, p.id, p.image, images);
        return null;
      }

      // 配列なら先頭
      if (Array.isArray(images) && images.length > 0) {
        if (typeof images[0] === "string" && images[0].trim()) {
          return encodeURI(images[0].trim());
        }
      }

      // オブジェクト(多重構造)なら最初の画像を探索
      if (typeof images === "object" && images !== null) {
        const parentKeys = Object.keys(images);
        for (const parentKey of parentKeys) {
          const childObj = images[parentKey];
          if (Array.isArray(childObj) && childObj.length > 0) {
            if (typeof childObj[0] === "string" && childObj[0].trim()) {
              return encodeURI(childObj[0].trim());
            }
          }
          if (typeof childObj === "object" && childObj !== null) {
            const childKeys = Object.keys(childObj);
            for (const childKey of childKeys) {
              const imgs = childObj[childKey];
              if (Array.isArray(imgs) && imgs.length > 0) {
                if (typeof imgs[0] === "string" && imgs[0].trim()) {
                  return encodeURI(imgs[0].trim());
                }
              }
            }
          }
        }
      }

      // フォールバック
      if (typeof p.image === "string" && p.image.trim()) {
        return encodeURI(p.image.trim());
      }

      console.warn(t.FailedLoadImage, p.id, p.image, images);
      return null;
    } catch (e) {
      console.error(t.ErrorLoadImage, p.id, e);
      return null;
    }
  };

  return (
    <DefaultLayout lang={lang as string} title="検索">
      <div className="p-4 space-y-6">
        {/* フリーワード検索 */}
        <div className="flex gap-2">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t.InputFreeWord}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        {/* カテゴリ検索 */}
        <div>
          <h2 className="font-bold mb-2">{t.SearchCategory}</h2>
          {categories.length > 0 && (
            <CategoryTree
              nodes={buildCategoryTree(categories)}
              onSelect={(selectedPath) =>
                router.push(`/${lang}/search/result?category=${encodeURIComponent(selectedPath.join(">"))}`)
              }
            />
          )}
        </div>

        {/* 人気検索ワード */}
        <div>
          <h2 className="font-bold mb-2">{t.SearchPopular}</h2>
          <div className="flex flex-wrap gap-2">
            {popularWords.map((word) => (
              <button
                key={word}
                onClick={() => {
                  setKeyword(word);
                  handleSearch();
                }}
                className="bg-yellow-200 px-3 py-1 rounded"
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* 注目商品 */}
        <div>
          <h2 className="font-bold mb-2">{t.SearchAttention}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredProducts.map((p) => {
              const imageSrc = getProductImage(p);
              return (
                <div key={p.id} className="border p-2 rounded">
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt={p.name}
                      className="w-full h-32 object-cover mb-2"
                    />
                  )}
                  <div className="text-sm">{p.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 検索履歴 */}
        <div>
          <h2 className="font-bold mb-2">{t.LogRecent}</h2>
          <div className="flex flex-wrap gap-2">
            {history.map((h) => (
              <button
                key={h}
                onClick={() => {
                  setKeyword(h);
                  handleSearch();
                }}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* 検索結果 */}
        {searchResults.length > 0 && (
          <div>
            <h2 className="font-bold mb-2">{t.SearchResult}</h2>
            <MasonryLayout
              products={searchResults}
              onLoadMore={() => {}}
              enableInfiniteScroll={true}
              lang={lang}
              t={{ title: t.SearchResult }} // 必要に応じて適切な翻訳関数またはオブジェクトを渡す
            />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default SearchPage;