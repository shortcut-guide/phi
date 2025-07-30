// /frontend/src/components/payment/PaypalButton.tsx

import React from "react";

// 実運用時はPayPal JS SDKやAPI連携を組み込む
type PaypalButtonProps = {
  items: { product: any; count: number }[];
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
};

const PaypalButton: React.FC<PaypalButtonProps> = ({
  items,
  onSuccess,
  onError,
}) => {
  // 決済ボタンクリック時
  const handlePay = async () => {
    try {
      // 実際はここでPayPal決済フローを開始する
      alert(
        `PayPalで${items.length}件の商品を購入します（ダミー実装）`
      );
      // 成功コールバック
      onSuccess?.({ status: "success" });
    } catch (err) {
      onError?.(err);
    }
  };

  return (
    <button
      type="button"
      className="w-full bg-blue-700 hover:bg-blue-900 text-white font-bold rounded-xl py-2 text-base tracking-wide transition"
      onClick={handlePay}
    >
      PayPalで支払う
    </button>
  );
};

export default PaypalButton;