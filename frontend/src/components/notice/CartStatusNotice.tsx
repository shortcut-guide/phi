// frontend/src/components/paypay/CartStatusNotice.tsx
import React, { useMemo } from "react";
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang?: string;
  loading: boolean;
  remainingCount: number;
  onGoCart: () => void;
  onContinue: () => void;
  onClose: () => void;
};

const CartStatusNotice: React.FC<Props> = ({ lang, loading, remainingCount, onGoCart, onContinue, onClose }) => {
  const t = (messages.paypalSuccess as any)[lang] ?? {};

  return (
    <div className="relative mx-auto max-w-xl px-4 py-10">
      <button
        aria-label={t.close}
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 text-green-700">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{t.title}</h1>
        </div>

        <div className="mt-4 text-gray-700">
          {loading ? (
            <p className="animate-pulse text-gray-500">Loading…</p>
          ) : remainingCount > 0 ? (
            <div>
              <p>{t.descWithItems}</p>
              <p className="mt-1 text-sm text-gray-500">{t.itemsRemain(remainingCount)}</p>
            </div>
          ) : (
            <p>{t.descEmpty}</p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {remainingCount > 0 ? (
            <button
              onClick={onGoCart}
              className="inline-flex items-center justify-center rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {t.goCart}
            </button>
          ) : (
            <button
              onClick={onContinue}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {t.continue}
            </button>
          )}
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartStatusNotice;