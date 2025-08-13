// frontend/src/hooks/useCartCount.ts
import { useEffect, useState } from "react";
import { loadCart } from "@/f/utils/cartLoader";
import { countItemsSafely } from "@/f/utils/cartCount";

export const useCartCount = () => {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await loadCart();
      if (!mounted) return;
      setCount(countItemsSafely(data));
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { loading, count };
};