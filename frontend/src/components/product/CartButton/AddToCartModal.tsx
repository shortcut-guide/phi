import React, { useState } from "react";

type Product = {
  id: string;
  name: string;
  variation?: Record<string, string[]>;
};

type VariationSelection = {
  variations: Record<string, string>;
  quantity: number;
};

type AddToCartModalProps = {
  product: Product;
  lang?: string;
  onClose: () => void;
  onSubmit: (items: VariationSelection[]) => void;
};

const getInitialVariation = (variation?: Record<string, string[]>) => {
  const initial: Record<string, string> = {};
  if (variation) {
    Object.entries(variation).forEach(([key, values]) => {
      initial[key] = values[0] || "";
    });
  }
  return initial;
};

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  product,
  onClose,
  onSubmit,
}) => {
  const [groups, setGroups] = useState<VariationSelection[]>([
    {
      variations: getInitialVariation(product.variation),
      quantity: 1,
    },
  ]);

  const handleVariationChange = (
    idx: number,
    key: string,
    value: string
  ) => {
    setGroups((prev) =>
      prev.map((g, i) =>
        i === idx
          ? { ...g, variations: { ...g.variations, [key]: value } }
          : g
      )
    );
  };

  const handleQuantityChange = (idx: number, quantity: number) => {
    setGroups((prev) =>
      prev.map((g, i) => (i === idx ? { ...g, quantity } : g))
    );
  };

  const handleAddGroup = () => {
    setGroups((prev) => [
      ...prev,
      {
        variations: getInitialVariation(product.variation),
        quantity: 1,
      },
    ]);
  };

  const handleRemoveGroup = (idx: number) => {
    setGroups((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    // 空quantityやvariationチェックをここで追加してもOK
    onSubmit(groups.filter((g) => g.quantity > 0));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative">
        <h2 className="text-lg font-bold mb-4">オプション選択</h2>
        {groups.map((group, idx) => (
          <div
            key={idx}
            className="mb-4 border rounded-xl p-4 bg-gray-50 relative"
          >
            {product.variation &&
              Object.entries(product.variation).map(([key, options]) => (
                <div key={key} className="mb-2">
                  <label className="block text-sm font-semibold mb-1">{key}</label>
                  <select
                    className="border rounded p-1 w-full"
                    value={group.variations[key]}
                    onChange={(e) =>
                      handleVariationChange(idx, key, e.target.value)
                    }
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            <div className="mb-2">
              <label className="block text-sm font-semibold mb-1">個数</label>
              <input
                type="number"
                min={1}
                value={group.quantity}
                onChange={(e) =>
                  handleQuantityChange(idx, Math.max(1, Number(e.target.value)))
                }
                className="border rounded p-1 w-24"
              />
            </div>
            {groups.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveGroup(idx)}
                className="absolute top-2 right-2 text-red-500 text-lg"
                title="削除"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={handleAddGroup}
            className="text-sm text-blue-600 underline"
          >
            バリエーションを追加
          </button>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white"
          >
            カートに追加
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
