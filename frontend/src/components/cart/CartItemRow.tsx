import React, { useEffect, useState } from "react";
import { messages } from "@/f/config/messageConfig";
import { getCart, saveCart } from "@/f/utils/cartStorage";
import {
  getProductImages,
  getProductName,
  getProductPlatform,
  getProductPrice,
  getCurrencySymbol,
  getCurrencyApiCode,
  getProductDescription,
  getProductObject,
  getProductVariations,
  getProductQuantity,
  getProductId
} from "@/f/utils/cartItemUtils";
import { useCurrencyInfo } from "@/f/components/product/PricePanel/useCurrencyInfo";
import { useExchangeRate } from "@/f/utils/useExchangeRate";
import { translateName } from "@/f/utils/translateUtils";

interface CartItemRowProps {
  item: any;
  lang: string;
  onCartUpdate: (updatedCart: any[]) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, lang, onCartUpdate }) => {
  const t = (messages.cartItem as any)[lang] ?? {};
  const products = item.products;
  if (!products) return null;

  const productId = getProductId(products);
  const productName = getProductName(products);
  const productPlatForm = getProductPlatform(products);
  const product = getProductObject(products);
  const description = getProductDescription(products);

  const price = getProductPrice(products);
  const currencySymbol = getCurrencySymbol();
  const currencyApiCode = getCurrencyApiCode(products);

  const currency = useCurrencyInfo(currencyApiCode);
  const { rate } = useExchangeRate(currency.code || currencyApiCode, "JPY");

  const images = getProductImages(product);
  const variations = getProductVariations(item);
  if (!variations) return null;

  // name翻訳用
  const [translatedName, setTranslatedName] = useState(productName);

  // 数量管理（入力値は内部で保持）
  const [inputQuantity, setInputQuantity] = useState<number>(() => {
    const q = getProductQuantity(item);
    return !q || q < 1 ? 1 : q;
  });

  useEffect(() => {
    let ignore = false;
    translateName(productName, 'ja', 'en').then(result => {
      if (!ignore) setTranslatedName(result);
    });
    return () => { ignore = true; };
  }, [productName]);

  useEffect(() => {
    const q = getProductQuantity(item);
    if (q && q !== inputQuantity) {
      setInputQuantity(q < 1 ? 1 : q);
    }
  }, [item]);

  const updateQuantityInCart = async (newQuantity: number) => {
    try {
      const cart = getCart();
      if (!Array.isArray(cart)) return;
      const updatedCart = cart.map((i: any) => {
        if (
          i.product?.id === productId &&
          JSON.stringify(i.variations) === JSON.stringify(variations)
        ) {
          return {
            ...i,
            quantity: newQuantity
          };
        }
        return i;
      });
      saveCart(updatedCart);
      onCartUpdate(updatedCart);
    } catch (error) {
      alert('Error updating quantity');
      console.error(error);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9]/g, '');
    let q = parseInt(v, 10);
    if (isNaN(q) || q < 1) q = 1;
    setInputQuantity(q);
    updateQuantityInCart(q);
  };

  const handleDecrease = () => {
    if (inputQuantity > 1) {
      const newQ = inputQuantity - 1;
      setInputQuantity(newQ);
      updateQuantityInCart(newQ);
    }
  };

  const handleIncrease = () => {
    const newQ = inputQuantity + 1;
    setInputQuantity(newQ);
    updateQuantityInCart(newQ);
  };

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
        <div className="text-[0.6875em] font-semibold mb-1 line-clamp-2 leading-tight">
          {translatedName}
        </div>
        {variations && (
          <div className="text-[0.6875em] text-gray-500 mb-1">{variations.variation}</div>
        )}
        <div className="flex items-end gap-2 mb-1">
          <span className="text-[0.6875em] font-bold">{currencySymbol}{Math.round(price * rate).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[0.6875em]">{t.quantity}</span>
          <button
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-[1.0em]"
            onClick={handleDecrease}
            aria-label={t.DecreasQuantity}
            type="button"
            disabled={inputQuantity <= 1}
          >–</button>
          <input
            type="number"
            className="w-12 px-1 py-0.5 text-center border rounded"
            min={1}
            value={inputQuantity}
            onChange={handleQuantityChange}
            onBlur={() => {
              if (!inputQuantity || inputQuantity < 1) {
                setInputQuantity(1);
                updateQuantityInCart(1);
              }
            }}
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <button
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-[1.0em]"
            onClick={handleIncrease}
            aria-label={t.IncreaseQuantity}
            type="button"
          >+</button>
        </div>
        {productPlatForm && <div className="text-[0.6875em] text-gray-400">({productPlatForm})</div>}
        <button
          className="ml-2 p-2 hover:bg-gray-100 rounded transition"
          aria-label={t.RemoveFromCart}
          onClick={handleRemove}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m2 0v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;