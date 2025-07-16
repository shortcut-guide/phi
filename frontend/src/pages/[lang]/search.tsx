import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import fallbackProducts from "@/d/products.json";

const SearchPage = () => {
  const router = useRouter();
  const { lang } = router.query;

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

  const handleSearch = () => {
    if (!keyword.trim()) return;
    const updatedHistory = [keyword, ...history.filter(h => h !== keyword)].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem("search_history", JSON.stringify(updatedHistory));
    router.push(`/${lang}/search/result?keyword=${encodeURIComponent(keyword)}`);
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
                    aria-label="トグル"
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

  return (
    <div className="p-4 space-y-6">
      {/* フリーワード検索 */}
      <div className="flex gap-2">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="検索ワードを入力"
          className="border rounded px-3 py-2 w-full"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white text-[0.6875em] px-2 py-1 rounded">検索</button>
      </div>

      {/* カテゴリ検索 */}
      <div>
        <h2 className="font-bold mb-2">カテゴリから探す</h2>
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
        <h2 className="font-bold mb-2">人気検索ワード</h2>
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
        <h2 className="font-bold mb-2">注目商品</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {featuredProducts.map((p) => (
            <div key={p.id} className="border p-2 rounded">
              <img src={p.image} alt={p.name} className="w-full h-32 object-cover mb-2" />
              <div className="text-sm">{p.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 検索履歴 */}
      <div>
        <h2 className="font-bold mb-2">最近の検索履歴</h2>
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
    </div>
  );
};

export default SearchPage;