import { POST } from "@/b/controllers/productController";
import { getProducts } from "@/b/models/ProductModel";


export const onRequestGet = async () => {
  const products = await getProducts();
  return new Response(JSON.stringify(products), { headers: { "Content-Type": "application/json" } });
};

export const onRequestPost = POST; // productController の POST をそのまま使用