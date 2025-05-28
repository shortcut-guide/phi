import { create } from 'zustand';
import type { SearchResult, SearchHistory, SearchState } from '@/b/types/search';

export const useSearchModel = create<SearchState>((set) => ({
  results: [],
  history: [],
  setResults: (results: SearchResult[]) => set({ results }),
  setHistory: (keyword: SearchHistory) =>
    set((state: SearchState) => ({
      history: [keyword, ...state.history.filter((k) => k !== keyword)].slice(0, 5),
    })),
}));