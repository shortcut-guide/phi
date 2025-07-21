// 検索APIのレスポンス型定義
type SearchApiResponse = {
  results: string[];
  suggestions: string[];
};

// 検索API呼び出し関数
// API例: /api/search?query=foo
// レスポンス例: { results: ["商品A", "商品B"], suggestions: ["商品C"] }
export async function fetchSearchResults(query: string): Promise<SearchApiResponse> {
  try {
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    // 結果が期待通りでなければ空配列返す
    if (
      typeof data === "object" &&
      Array.isArray(data.results) &&
      Array.isArray(data.suggestions)
    ) {
      return data as SearchApiResponse;
    }
    // 型が合わない場合は空配列
    return { results: [], suggestions: [] };
  } catch {
    return { results: [], suggestions: [] };
  }
}
// frontend/src/components/search/SearchBar.tsx
import { useState, useEffect } from 'react';
import { withLangMessagesSSR } from "@/f/utils/withLangSSR";
export const getServerSideProps = withLangMessagesSSR("index");

export function SearchBar() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch('/searchlogs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch {
        // handle error silently
      }
    };
    fetchLogs();
  }, []);

  // 検索API: inputを元に検索し、results, suggestionsをセット
  const handleSearch = async () => {
    const res = await fetchSearchResults(input);
    if (res && typeof res === "object" && "results" in res) {
      setResults(res.results);
      if ("suggestions" in res && Array.isArray(res.suggestions)) {
        setSuggestions(res.suggestions);
      }
    } else if (Array.isArray(res)) {
      setResults(res);
    } else {
      setResults([]);
    }
  };

  // サジェストクリック時も同様に検索し、results, suggestionsをセット
  const handleSuggestionClick = async (keyword: string) => {
    setInput(keyword);
    const res = await fetchSearchResults(keyword);
    if (res && typeof res === "object" && "results" in res) {
      setResults(res.results);
      if ("suggestions" in res && Array.isArray(res.suggestions)) {
        setSuggestions(res.suggestions);
      }
    } else if (Array.isArray(res)) {
      setResults(res);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <input
        type="text"
        value={input}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setInput(target.value);
        }}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="border p-2 w-full rounded"
        placeholder="商品名・カテゴリ・IDを検索"
      />
      {suggestions.length > 0 && (
        <ul className="bg-white border rounded shadow">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                className="w-full text-left p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(s)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSuggestionClick(s);
                  }
                }}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* 検索結果を下部に表示 */}
      {results.length > 0 && (
        <div>
          <h3 className="font-semibold mt-4">検索結果</h3>
          <ul className="list-disc list-inside bg-white border rounded shadow p-2 max-h-64 overflow-auto">
            {results.map((result, idx) => (
              <li key={idx} className="text-sm text-gray-800">
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}
      {logs.length > 0 && (
        <div>
          <h3 className="font-semibold mt-4">検索履歴</h3>
          <ul className="list-disc list-inside bg-white border rounded shadow p-2 max-h-48 overflow-auto">
            {logs.map((log, index) => (
              <li key={index} className="text-sm text-gray-700">
                {log}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}