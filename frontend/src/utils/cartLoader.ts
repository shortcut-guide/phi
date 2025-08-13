// frontend/src/utils/cartLoader.ts
type AnyObj = Record<string, any>;

export const loadCart = async (): Promise<unknown> => {
  try {
    const mod = await import("@/f/utils/cartStorage").catch(() => null);
    const apiNames = ["getCart", "readCart", "load"];
    for (const name of apiNames) {
      const fn = (mod as AnyObj)?.[name];
      if (typeof fn === "function") {
        const data = fn();
        if (data !== undefined) return data;
      }
    }
  } catch {}

  try {
    if (typeof window !== "undefined") {
      const keys = ["cart", "shopping_cart", "ec_cart", "phi_cart"];
      for (const k of keys) {
        const raw = window.localStorage.getItem(k);
        if (raw) return JSON.parse(raw);
      }
    }
  } catch {}

  return null;
};