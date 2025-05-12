import { updateProduct, deleteProduct } from "@/b/models/ProductModel";
import { getDB } from "@/b/utils/d1";

export const onRequestPut = async ({ request, params, env }: any) => {
  const db = getDB(env);
  const body = await request.json();
  await updateProduct(db, { ...body, id: params.id });
  return new Response("Updated");
};

export const onRequestDelete = async ({ params, env }: any) => {
  const db = getDB(env);
  await deleteProduct(db, params.id);
  return new Response("Deleted");
};