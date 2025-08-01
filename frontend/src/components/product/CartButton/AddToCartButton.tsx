import React from "react";
import { messages } from "@/f/config/messageConfig";

type AddToCartButtonProps = {
  lang: string;
  product: any;
  quantity?: number;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  lang,
  product,
  quantity = 1,
  onSuccess,
  onError,
}) => {
  const t = messages.addtocart?.[lang] ?? {};

  const handleAddToCart = async () => {
    try {
      const res = await fetch("/add/cart/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ product, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess?.(data.cartItem);
        alert(t.addedToCart);
      } else {
        throw new Error(data.error || t.errorAddToCartFailed);
      }
    } catch (err) {
      onError?.(err);
      alert(t.errorCart);
    }
  };

  return (
    <button
      type="button"
      className={`w-full bg-[#FF9900] hover:bg-[#FFB84D] text-white font-bold rounded-xl py-2 mt-2 text-base tracking-wide transition`}
      onClick={handleAddToCart}
    >
      {t.addToCart}
    </button>
  );
};

export default AddToCartButton;