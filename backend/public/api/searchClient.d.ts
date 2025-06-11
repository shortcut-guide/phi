import type { SearchResult } from '@/b/types/search';
/**
 * 商品検索実行
 * @param query - 検索キーワード
 * @returns 検索結果のリスト
 */
export declare function fetchSearchResults(query: string): Promise<SearchResult[]>;
/**
 * サジェストワード取得
 * @param query - 入力中のキーワード
 * @returns サジェスト候補の文字列配列
 */
export declare function fetchSuggestions(query: string): Promise<string[]>;
