// frontend/src/utils/cartStorage.ts

export type CartItem = {
  products: any;
  variations: Record<string, string>;
  quantity: number;
};

const CART_KEY = "phis.jp_cart_items";

export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = window.localStorage.getItem(CART_KEY);
    if (!data) return [];
    return JSON.parse(data) as CartItem[];
  } catch (e) {
    return [];
  }
};

export const saveCart = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const addToCart = (item: CartItem) => {
  const cart = getCart();
  const idx = cart.findIndex(
    c => c.products.id === item.products.id && JSON.stringify(c.variations) === JSON.stringify(item.variations)
  );
  if (idx !== -1) {
    cart[idx].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
  return cart;
};