export interface SearchResult {
  // Define the structure of a search result here
  [key: string]: any;
}

export type SearchHistory = string;

export interface SearchState {
  results: SearchResult[];
  history: SearchHistory[];
  setResults: (results: SearchResult[]) => void;
  setHistory: (keyword: SearchHistory) => void;
}