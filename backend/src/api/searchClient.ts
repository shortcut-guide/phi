// frontend/src/api/searchClient.ts
import type { SearchResult } from '@/b/types/search';
import { messages } from "@/b/config/messageConfig";
import { getLang } from "@/b/utils/lang";

const lang = getLang();
const t = messages.searchClient?.[lang];

const API_BASE = '/api/products/search';

/**
 * 商品検索実行
 * @param query - 検索キーワード
 * @returns 検索結果のリスト
 */
export async function fetchSearchResults(query: string): Promise<SearchResult[]> {
  const res = await fetch(`${API_BASE}?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error(t.ErrorSearch + `: ${res.status}`);
  }
  return res.json();
}

/**
 * サジェストワード取得
 * @param query - 入力中のキーワード
 * @returns サジェスト候補の文字列配列
 */
export async function fetchSuggestions(query: string): Promise<string[]> {
  const res = await fetch(`${API_BASE}/suggest?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error(t.ErrorSuggest + `: ${res.status}`);
  }
  return res.json();
}