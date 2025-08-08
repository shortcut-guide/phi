// frontend/src/utils/cartItemUtils.ts

import { useCurrencyInfo } from "@/f/components/product/PricePanel/useCurrencyInfo";
import { useExchangeRate } from "@/f/utils/useExchangeRate";

// 画像配列を返す
export function getProductImages(product: any): string[] {
  if (!product || !Array.isArray(product.images)) return [];
  return product.images.filter(
    (img: string) =>
      typeof img === "string" &&
      (img.toLowerCase().endsWith(".png") ||
        img.toLowerCase().endsWith(".jpg") ||
        img.toLowerCase().endsWith(".jpeg"))
  );
}

// 商品名
export function getProductName(products: any): string {
  return products?.name || "";
}

// プラットフォーム
export function getProductPlatform(products: any): string {
  return products?.platform || "";
}

// 商品価格
export function getProductPrice(products: any): number | undefined {
  return typeof products?.price === "number" ? products.price : undefined;
}

// 通貨記号
export function getCurrencySymbol(): string {
  // 円のみで固定
  return "¥";
}

// 通貨コード
export function getCurrencyApiCode(products: any): string {
  // useCurrencyInfoで補正可能
  return products?.currency || "JPY";
}

// 商品詳細
export function getProductDescription(products: any): string {
  return products?.ec_data?.product?.description || "";
}

// 商品本体
export function getProductObject(products: any): any {
  return products?.ec_data?.product || {};
}

// variations
export function getProductVariations(item: any): any {
  return item?.variations || {};
}

// 数量
export function getProductQuantity(item: any): number {
  return typeof item?.quantity === "number" ? item.quantity : 0;
}

// 商品ID
export function getProductId(products: any): any {
  return products?.id;
}