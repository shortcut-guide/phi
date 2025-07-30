// frontend/src/f/hooks/useCartItems.ts

import { useState } from "react";

/**
 * カート商品の配列を返すフック
 * 実運用ではContextやグローバル状態管理から取得する設計にリファクタ可
 * ここではサンプルとしてダミーデータを返却
 */
export type CartItem = {
  product: any;
  count: number;
};

// 最低限のダミー実装
export function useCartItems(): CartItem[] {
  // サンプル: ローカルストレージやContext未導入の場合
  const [items] = useState<CartItem[]>([]);
  return items;
}