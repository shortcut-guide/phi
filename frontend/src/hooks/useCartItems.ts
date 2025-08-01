import { useState, useEffect } from "react";

export function useCartItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/add/cart")
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data.cartItems) ? data.cartItems : []))
      .catch(() => setItems([]));
  }, []);

  return items;
}