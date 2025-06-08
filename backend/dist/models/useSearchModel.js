import { create } from 'zustand';
export const useSearchModel = create((set) => ({
    results: [],
    history: [],
    setResults: (results) => set({ results }),
    setHistory: (keyword) => set((state) => ({
        history: [keyword, ...state.history.filter((k) => k !== keyword)].slice(0, 5),
    })),
}));
