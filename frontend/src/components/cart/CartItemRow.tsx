import React from "react";
import { messages } from "@/f/config/messageConfig";
import { getCart, saveCart } from "@/f/utils/cartStorage";

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
  const productPrice = products.price;
  const ec_data = products.ec_data;
  const product = ec_data.product;
  const description = product.description;

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
          <img src={images[0]} alt={productName} style={{ width: 64, height: 64, objectFit: "cover" }} />
        )}
      <div className="flex-1">
        <div className="text-sm font-medium truncate mb-1">{productName}</div>
        {variations && (
          <div className="text-xs text-gray-500">
            {t.variation}: {variations.variation}
          </div>
        )}
        <div className="flex items-end gap-2">
          <span className="text-lg font-bold text-gray-900">{t.price}: ¥{productPrice.toLocaleString()}円</span>
        </div>
        <div className="text-xs mt-1 text-gray-500">{t.quantity} {quantity}</div>
        <button
          className="px-2 py-1 bg-red-500 text-white rounded"
          onClick={handleRemove}
        >
          {t.remove}
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;