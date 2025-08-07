import React from "react";
import { messages } from "@/f/config/messageConfig";
import { useCurrencyInfo } from "@/f/components/product/PricePanel/useCurrencyInfo";
import { getCart, saveCart } from "@/f/utils/cartStorage";
import { useExchangeRate } from "@/f/utils/useExchangeRate";

interface CartItemRowProps {
  item: any;
  lang: string;
  onCartUpdate: (updatedCart: any[]) => void;
};

const CartItemRow: React.FC<CartItemRowProps> = ({ item, lang, onCartUpdate }) => {
  const t = (messages.cartItem as any)[lang] ?? {};
  const products = item.products;
  if (!products) return null;

  const productId = products.id;
  const productName = products.name;
  const productPlatForm = products.platform;
  const ec_data = products.ec_data;
  const product = ec_data.product;
  const description = product.description;

  const productPrice = products.price;
  const price = typeof productPrice === "number" ? productPrice : undefined;
  const currencyCode = products.currency;
  const currencySymbol = "¥";
  const currency = useCurrencyInfo(currencyCode);
  const currencyApiCode = currency.code || currencyCode || "JPY";
  const { rate } = useExchangeRate(currencyApiCode, "JPY");

  const images = Array.isArray(product.images)
    ? product.images.filter((img: string) =>
        typeof img === "string" &&
        (img.toLowerCase().endsWith(".png") ||
          img.toLowerCase().endsWith(".jpg") ||
          img.toLowerCase().endsWith(".jpeg"))
      )
    : [];

  const quantity = item.quantity;
  if (!quantity || quantity <= 0) return null;

  const variations = item.variations;
  if (!variations) return null;

  const handleRemove = async () => {
    try {
      const cart = getCart();
      if(!Array.isArray(cart)) return;

      const updatedCart = cart.filter(
        (i: any) =>
          !(i.product?.id === productId &&
            JSON.stringify(i.variations) === JSON.stringify(variations)
          )
      );

      saveCart(updatedCart);
      onCartUpdate(updatedCart);
      
    } catch (error) {
      alert('Error removing item from cart');
      console.error(error);
    }
  };

  return (
    <div className="flex gap-3 py-4 border-b last:border-none">
      {images.length > 0 && (
          <img src={images[0]} alt={productName} className="w-20 h-20 object-cover rounded bg-gray-100" style={{ minWidth: 80, minHeight: 80 }} />
        )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate mb-1">{productName}</div>
        {variations && (
          <div className="text-xs text-gray-500 mb-1">
            {t.variation}: {variations.variation}
          </div>
        )}
        <div className="flex items-end gap-2 mb-1">
          <span className="text-lg font-bold text-gray-900">{currencySymbol}{Math.round(price * rate).toLocaleString()}</span>
        </div>
        <div className="text-xs mt-1 text-gray-500">{t.quantity} {quantity}</div>
        {productPlatForm && <div className="text-xs text-gray-400">({productPlatForm})</div>}
        <button
          className="ml-2 p-2 hover:bg-gray-100 rounded transition"
          aria-label="カートから削除"
          onClick={handleRemove}
          type="button"
        >
          {/* ゴミ箱アイコン（Heroicons/MaterialIconsどちらでもOK） */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m2 0v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;