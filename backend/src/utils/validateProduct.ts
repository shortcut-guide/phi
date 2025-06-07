// backend/utils/validateProduct.ts
import type { Product } from "@/b/types/product";

export function validateProduct(product: any): product is Product {
  if (typeof product !== "object" || product === null) return false;

  const requiredStringFields = ["id", "name", "shop_name", "platform"];
  for (const field of requiredStringFields) {
    if (typeof product[field] !== "string") return false;
  }

  if (
    "base_price" in product &&
    product.base_price !== undefined &&
    typeof product.base_price !== "number"
  ) {
    return false;
  }

  if (
    typeof product.ec_data !== "object" ||
    !Array.isArray(product.ec_data.images) ||
    !product.ec_data.images.every((url: any) => typeof url === "string")
  ) {
    return false;
  }

  return true;
}
