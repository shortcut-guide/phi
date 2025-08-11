import React, { useCallback, useMemo } from "react";
import { getProductPrice, getCurrencyApiCode } from "@/f/utils/cartItemUtils";
import { useExchangeRate } from "@/f/utils/useExchangeRate";
import { messages } from "@/f/config/messageConfig";

type PaypalButtonProps = {
  items: { product?: any; products?: any; name?: string; count?: number; quantity?: number }[];
  lang: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
};

const PaypalButton: React.FC<PaypalButtonProps> = ({ items, lang, onSuccess, onError }) => {
  const t = (messages.paymentButton as any)[lang] ?? {};

  const sourceCurrency = useMemo(() => {
    const snap = Array.isArray(items) ? items : [];
    const first = snap[0];
    const prod = first?.products ?? first?.product ?? {};
    const code = getCurrencyApiCode(prod);
    return typeof code === "string" && code ? code.toUpperCase() : "JPY";
  }, [items]);

  const { rate } = useExchangeRate(sourceCurrency, "JPY");
  const safeRate = useMemo(() => {
    if (sourceCurrency === "JPY") return 1;
    return typeof rate === "number" && isFinite(rate) && rate > 0 ? rate : 0;
  }, [rate, sourceCurrency]);

  const normalizedItems = useMemo(() => {
    const snap = Array.isArray(items) ? items : [];
    return snap.map((it) => {
      const prod = it?.products ?? it?.product ?? {};
      const name = String(
        prod?.ec_data?.product?.name ?? prod?.name ?? it?.name ?? "Item"
      );
      const unitBase = Number(getProductPrice(prod) ?? 0);
      const base = Number.isFinite(unitBase) ? Math.max(0, unitBase) : 0;
      const unitJPY = sourceCurrency === "JPY" ? Math.round(base) : Math.round(base * safeRate);
      const quantityNum = Number(it?.quantity ?? it?.count ?? 1);
      const quantity = Number.isFinite(quantityNum) && quantityNum > 0 ? Math.floor(quantityNum) : 1;
      return {
        name,
        unit_amount: { currency_code: "JPY", value: String(unitJPY) },
        quantity: String(quantity),
      };
    });
  }, [items, safeRate, sourceCurrency]);

  const handlePay = useCallback(async () => {
    const base = String(process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
    const url = `${base}/api/paypal/create-order`;

    if (!Array.isArray(normalizedItems) || normalizedItems.length === 0) {
      alert("No items to purchase");
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      if (sourceCurrency !== "JPY" && safeRate === 0) {
        alert("為替レートが取得できませんでした");
        return;
      }
      console.debug("[PayPal] currency", { sourceCurrency, rate: safeRate });
      const payload = { items: normalizedItems };
      console.debug("[PayPal] create-order request", url, payload);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`create-order failed: ${res.status} ${errText}`);
      }
      const data = await res.json();
      console.debug("[PayPal] create-order response", data);

      const approveLink = Array.isArray(data?.links)
        ? data.links.find((l: any) => l?.rel === "approve" || l?.rel === "payer-action")?.href
        : undefined;

      if (approveLink) {
        window.location.href = approveLink;
        return;
      }

      onSuccess?.(data);
    } catch (err) {
      console.error("[PayPal] create-order error", err);
      onError?.(err);
    } finally {
      clearTimeout(timeoutId);
    }
  }, [normalizedItems, onError, onSuccess, sourceCurrency, safeRate]);

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