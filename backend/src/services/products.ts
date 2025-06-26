import { cMessages } from "@/b/config/consoleMessage";
import { createProduct, updateProduct, deleteProduct, getFilteredProducts } from "@/b/models/ProductModel";
import { validateProduct } from "@/b/utils/validateProduct";
import type { Product } from "@/b/types/product";

export async function fetchAllProducts() {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('商品取得に失敗しました');
  return res.json();
}

export async function parseAndValidateProduct(data: any, id?: string): Promise<Product> {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid request body: expected an object");
  }

  const product: Product = {
    id: id ?? crypto.randomUUID(),
    name: data.name ?? "Unknown Product",
    shop_name: data.shop_name ?? "Unknown Shop",
    platform: data.platform ?? "Unknown Platform",
    base_price: data.base_price ?? 0,
    ec_data: typeof data.ec_data === "string" ? data.ec_data : JSON.stringify(data.ec_data ?? {}),
  };

  if (!validateProduct(product)) {
    throw new Error(cMessages[2]); // Invalid product data
  }

  return product;
}

export async function handleCreateProduct(request: Request): Promise<Response> {
  const product = await parseAndValidateProduct(await request.json());
  await createProduct(product);
  return new Response(JSON.stringify({ status: "success", message: cMessages[1] }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleUpdateProduct(request: Request, id?: string): Promise<Response> {
  if (!id) {
    return new Response(JSON.stringify({ status: "error", message: "Product ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const product = await parseAndValidateProduct(await request.json(), id);
  await updateProduct(product);
  return new Response(JSON.stringify({ status: "success", message: cMessages[1] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleDeleteProduct(id?: string): Promise<Response> {
  if (!id) {
    return new Response(JSON.stringify({ status: "error", message: "Product ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  await deleteProduct(id);
  return new Response(JSON.stringify({ status: "success", message: cMessages[1] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleGetFilteredProducts(shop?: string, limit: number = 100): Promise<Product[]> {
  return (await getFilteredProducts({ shop, limit })) ?? [];
}