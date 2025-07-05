// frontend/src/components/search/SearchBar.tsx
import { useState, useEffect } from 'react';
import { withLangMessagesSSR } from "@/f/utils/withLangSSR";
export const getServerSideProps = withLangMessagesSSR("index");
import { fetchSearchResults, fetchSuggestions } from '@/b/api/searchClient';
import { useSearchModel } from '@/b/models/useSearchModel';


export function SearchBar() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { setResults, setHistory } = useSearchModel();

  useEffect(() => {
    if (input.length >= 2) {
      fetchSuggestions(input).then(setSuggestions);
    }
  }, [input]);

  const handleSearch = async () => {
    const results = await fetchSearchResults(input);
    setResults(results);
    setHistory(input);
  };

  const handleSuggestionClick = async (keyword: string) => {
    setInput(keyword);
    const results = await fetchSearchResults(keyword);
    setResults(results);
    setHistory(keyword);
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
    </div>
  );
}