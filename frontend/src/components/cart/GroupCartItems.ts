type CartItem = { product: any; count: number };

export type CartGroup = {
  items: { product: any; count: number }[];
  shop: string;
};

export const GroupCartItems = (cartItems: CartItem[]): CartGroup[] => {
  const groups: { [shop: string]: CartGroup } = {};
  for (const { product, count } of cartItems) {
    const shop = product.ec_data.shop.name ?? "Unknown Shop";
    if (!groups[shop]) {
      groups[shop] = {
        shop,
        items: [],
      };
    }
    groups[shop].items.push({ product, count });
  }
  return Object.values(groups);
};