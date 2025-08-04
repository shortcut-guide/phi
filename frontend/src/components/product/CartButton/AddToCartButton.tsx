import React, { useState } from "react";
import { messages } from "@/f/config/messageConfig";
import AddToCartModal from "./AddToCartModal";
import { addToCart, CartItem } from "@/f/utils/cartStorage";

type VariationSelection = {
  variations: Record<string, string>;
  quantity: number;
};

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
  const [open, setOpen] = useState(false);

  const handleAddToCart = (items: VariationSelection[]) => {
    try {
      const addedCart = items.map(i => ({
        products: product,
        variations: i.variations,
        quantity: i.quantity,
      }));

      let cartResult: CartItem[] = [];
      addedCart.forEach(item => {
        cartResult = addToCart(item);
      });

      onSuccess?.(cartResult);
      alert(t.addedToCart);
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
        {t.addToCart}
      </button>
      {open && (
        <AddToCartModal
          items={product}
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