// frontend/src/utils/cartCount.ts
type AnyObj = Record<string, any>;

export const countItemsSafely = (cart: unknown): number => {
  try {
    if (!cart) return 0;

    if (Array.isArray(cart)) {
      return cart.reduce((sum, entry) => {
        if (entry && typeof entry === "object") {
          const obj = entry as AnyObj;
          if (Array.isArray(obj.items)) return sum + countItemsSafely(obj.items);
          if ("quantity" in obj) {
            const q = Number(obj.quantity);
            return sum + (Number.isFinite(q) ? Math.max(0, q) : 1);
          }
          return sum + 1;
        }
        return sum;
      }, 0);
    }

    if (typeof cart === "object") {
      const obj = cart as AnyObj;
      if (Array.isArray(obj.groups)) return countItemsSafely(obj.groups);
      return Object.values(obj).reduce((sum, v) => sum + countItemsSafely(v), 0);
    }

    return 0;
  } catch {
    return 0;
  }
};