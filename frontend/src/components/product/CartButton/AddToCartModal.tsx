import React, { useState } from "react";
import { messages } from "@/f/config/messageConfig";

type Product = {
  id: string;
  name: string;
  contry: string;
  currency: string;
  platform: string;
  price: number;
  ec_data?: Record<string, any>;
};

type VariationSelection = {
  variations: Record<string, string>;
  quantity: number;
};

type AddToCartModalProps = {
  items: Product;
  lang?: string;
  onClose: () => void;
  onSubmit: (items: VariationSelection[]) => void;
};

type NormalizedVariation = {
  label: string;
  options: string[];
};

const getVariationList = (variation: Record<string, any> | undefined): NormalizedVariation[] => {

  if (!variation) return [];
  // Amazon型
  if (Object.values(variation).every(v => Array.isArray(v))) {
    return Object.entries(variation).map(([label, options]) => ({
      label,
      options: options as string[],
    }));
  }
  // Taobao型
  if (Object.values(variation).every(v => typeof v === "object" && v !== null && !Array.isArray(v))) {
    return [{
      label: "variation",
      options: Object.keys(variation),
    }];
  }
  return [];
};

const getInitialVariation = (variationList: NormalizedVariation[]): Record<string, string> => {
  const initial: Record<string, string> = {};
  variationList.forEach(v => {
    initial[v.label] = v.options[0] || "";
  });
  return initial;
};

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  items,
  lang,
  onClose,
  onSubmit,
}) => {
  const t = messages.addtocart?.[lang] ?? {};
  const variationList = getVariationList(items.ec_data?.product?.variation);
  const [groups, setGroups] = useState<VariationSelection[]>([
    {
      variations: getInitialVariation(variationList),
      quantity: 1,
    },
  ]);

  const handleVariationChange = (
    idx: number,
    key: string,
    value: string
  ) => {
    setGroups(prev =>
      prev.map((g, i) =>
        i === idx
          ? { ...g, variations: { ...g.variations, [key]: value } }
          : g
      )
    );
  };

  const handleQuantityChange = (idx: number, quantity: number) => {
    setGroups(prev =>
      prev.map((g, i) => (i === idx ? { ...g, quantity } : g))
    );
  };

  const handleAddGroup = () => {
    setGroups(prev => [
      ...prev,
      {
        variations: getInitialVariation(variationList),
        quantity: 1,
      },
    ]);
  };

  const handleRemoveGroup = (idx: number) => {
    setGroups(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    const sendItems = groups.filter(g => g.quantity > 0);
    onSubmit(sendItems);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative">
        <h2 className="text-lg font-bold mb-4">{t.option}</h2>
        {groups.map((group, idx) => (
          <div key={idx} className="mb-4 border rounded-xl p-4 bg-gray-50 relative">
            {/* variation選択肢生成（ラジオボタン見た目カスタム） */}
            {variationList.map(({ label, options }) =>
              options.length === 0 ? null : (
                <div key={label} className="mb-2">
                  <label className="block text-sm font-semibold mb-1">
                    {label === "variation" ? t.variationLabel || "種類" : label}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {options.map(opt => (
                      <label
                        key={opt}
                        className={`relative cursor-pointer rounded px-3 py-1 border 
                          ${group.variations[label] === opt ? "border-blue-500 font-bold bg-blue-50" : "border-gray-300 bg-white"}
                          transition`}
                      >
                        <input
                          type="radio"
                          name={`variation-${label}-${idx}`}
                          value={opt}
                          checked={group.variations[label] === opt}
                          onChange={() => handleVariationChange(idx, label, opt)}
                          className="absolute opacity-0 w-0 h-0 pointer-events-none"
                          tabIndex={-1}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              )
            )}
            <div className="mb-2">
              <label className="block text-sm font-semibold mb-1">{t.quantity}</label>
              <input
                type="number"
                min={1}
                value={group.quantity}
                onChange={e =>
                  handleQuantityChange(idx, Math.max(1, Number(e.target.value)))
                }
                className="border rounded p-1 w-24"
              />
            </div>
            {groups.length > 1 && (
              <button type="button" onClick={() => handleRemoveGroup(idx)} className="absolute top-2 right-2 text-red-500 text-lg" title={t.delete}>×</button>
            )}
          </div>
        ))}
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={handleAddGroup}
            className="text-sm text-blue-600 underline"
          >
            {t.addToValiation}
          </button>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200"
          >
            {t.addToCancel}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white"
          >
            {t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;