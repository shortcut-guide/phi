import React, { useState } from "react";
import { messages } from "@/f/config/messageConfig";
import AddToCartModal from "./AddToCartModal";

type VariationSelection = {
  variations: Record<string, string>;
  quantity: number;
};

type AddToCartButtonProps = {
  lang: string;
  product: any;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  lang,
  product,
  onSuccess,
  onError,
}) => {
  const t = messages.addtocart?.[lang] ?? {};
  const [open, setOpen] = useState(false);

  const handleAddToCart = async (items: VariationSelection[]) => {
    try {
      const res = await fetch("/add/cart/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: items.map(i => ({
            productId: product.id,
            variations: i.variations,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess?.(data.cartItems);
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
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full bg-[#FF9900] hover:bg-[#FFB84D] text-white font-bold rounded-xl py-2 mt-2 text-base tracking-wide transition"
      >
        {t.addToCart ?? "カートに入れる"}
      </button>
      {open && (
        <AddToCartModal
          product={product}
          lang={lang}
          onClose={() => setOpen(false)}
          onSubmit={items => {
            handleAddToCart(items);
            setOpen(false);
          }}
        />
      )}
    </>
  );
};

export default AddToCartButton;
