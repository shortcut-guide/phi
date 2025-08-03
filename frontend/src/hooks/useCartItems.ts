import { useState, useEffect } from "react";

// 保存時と同じキーにする
const CART_KEY = "cart_items_v1";

export function useCartItems() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const data = window.localStorage.getItem(CART_KEY);
      if (!data) {
        setItems([]);
        return;
      }
      const parsed = JSON.parse(data);
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  }, []);

  return items;
}