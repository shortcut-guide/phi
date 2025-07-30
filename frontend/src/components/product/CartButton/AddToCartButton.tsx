import React from "react";
import { messages } from "@/f/config/messageConfig";

type AddToCartButtonProps = {
  disabled?: boolean;
  className?: string;
  lang: string;
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  disabled = false,
  className = "",
  lang,
}) => {
  const t_addtocart = messages.addtocart?.[lang] ?? {};
  return (
    <>
      <button
        type="button"
        className={`w-full bg-[#FF9900] hover:bg-[#FFB84D] text-white font-bold rounded-xl py-2 mt-2 text-base tracking-wide transition ${className}`}
        disabled={disabled}
      >
        {t_addtocart.addToCart}
      </button>
    </>
  )
};

export default AddToCartButton;