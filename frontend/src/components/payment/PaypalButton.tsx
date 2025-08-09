import React, { useCallback, useMemo } from "react";
import { messages } from "@/f/config/messageConfig";

type PaypalButtonProps = {
  items: { product: any; count?: number; quantity?: number }[];
  lang: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
};

const PaypalButton: React.FC<PaypalButtonProps> = ({ items, lang, onSuccess, onError }) => {
  const t = (messages.paymentButton as any)[lang] ?? {};

  const normalizedItems = useMemo(() => {
    return (items || []).map((it) => {
      const p = it?.product ?? {};
      const name = String(p?.name ?? p?.title ?? "Item");
      const currency =
        (p?.currency ??
          p?.ec_data?.product?.currency ??
          p?.ec_data?.currency ??
          "JPY").toString().toUpperCase();
      const priceRaw =
        p?.price ??
        p?.unit_price ??
        p?.ec_data?.product?.price ??
        p?.ec_data?.price ??
        0;
      const price = Number(priceRaw);
      const quantityNum = Number(it?.count ?? it?.quantity ?? 1);
      const quantity =
        Number.isFinite(quantityNum) && quantityNum > 0 ? Math.floor(quantityNum) : 1;

      return {
        name,
        unit_amount: {
          currency_code: currency,
          value: String(Number.isFinite(price) ? price : 0),
        },
        quantity: String(quantity),
      };
    });
  }, [items]);

  const handlePay = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    try {
      const res = await fetch(`${apiUrl}/api/paypal/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: normalizedItems }),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`create-order failed: ${res.status} ${errText}`);
      }
      const data = await res.json();

      const approveLink = Array.isArray(data?.links)
        ? data.links.find((l: any) => l?.rel === "approve" || l?.rel === "payer-action")?.href
        : undefined;

      if (approveLink) {
        window.location.href = approveLink;
        return;
      }

      onSuccess?.(data);
    } catch (err) {
      onError?.(err);
    }
  }, [normalizedItems, onError, onSuccess]);

  return (
    <button
      type="button"
      className="w-full bg-blue-700 hover:bg-blue-900 text-white font-bold rounded-xl py-2 text-base tracking-wide transition"
      onClick={handlePay}
    >
      {t.paypal}
    </button>
  );
};

export default PaypalButton;