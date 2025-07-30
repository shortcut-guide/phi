type CartItem = { product: any; count: number };

export type CartGroup = {
  shop: string;
  isOwnShop: boolean;
  cartAddUrl?: string;
  items: CartItem[];
};

export const GroupCartItems = (cartItems: CartItem[]): CartGroup[] => {
  const groups: Record<string, CartGroup> = {};
  for (const { product, count } of cartItems) {
    const shop = product.ec_data.shop ?? "その他";
    if (!groups[shop]) {
      groups[shop] = {
        shop,
        isOwnShop: !!product.ec_data.is_own_shop,
        cartAddUrl: product.ec_data.cart_add_url,
        items: [],
      };
    }
    groups[shop].items.push({ product, count });
  }
  return Object.values(groups);
};