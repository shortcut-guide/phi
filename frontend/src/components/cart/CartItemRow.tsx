import React from "react";
import { messages } from "@/f/config/messageConfig";

type CartItemRowProps = {
  item: any;
  lang: string;
};

const CartItemRow: React.FC<CartItemRowProps> = ({ item, lang }) => {
  const t = (messages.cartItem as any)[lang] ?? {};

  const handleRemove = async () => {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: item.id }),
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      window.location.reload();
    } catch (error) {
      alert('Error removing item from cart');
      console.error(error);
    }
  };

  return (
    <tr>
      <td>
        <img src={item.image} alt={item.title} style={{ width: 64, height: 64, objectFit: "cover" }} />
      </td>
      <td>
        <div>{item.title}</div>
        {item.variation && (
          <div className="text-xs text-gray-500">
            {t.cartItem.variation}: {item.variation}
          </div>
        )}
      </td>
      <td>
        {t.cartItem.price}: ¥{item.price.toLocaleString()}
      </td>
      <td>
        {t.cartItem.quantity}: {item.quantity}
      </td>
      <td>
        <button
          className="px-2 py-1 bg-red-500 text-white rounded"
          onClick={handleRemove}
        >
          {t.cartItem.remove}
        </button>
      </td>
    </tr>
  );
};

export default CartItemRow;