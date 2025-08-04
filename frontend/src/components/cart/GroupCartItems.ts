export type CartGroup = {
  items: any;
  shop: string;
};

export const GroupCartItems = (cartItems): CartGroup[] => {
  if (!cartItems || cartItems.length === 0) return [];
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