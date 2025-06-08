import { getProducts, createProduct } from "@/b/models/ProductModel";
import { getDB } from "@/b/utils/d1";
export const onRequestGet = async ({ env }) => {
    const db = getDB(env);
    const products = await getProducts(db);
    return new Response(JSON.stringify(products), { headers: { "Content-Type": "application/json" } });
};
export const onRequestPost = async ({ request, env }) => {
    const db = getDB(env);
    const body = await request.json();
    const id = crypto.randomUUID();
    await createProduct(db, { ...body, id });
    return new Response("Created", { status: 201 });
};
