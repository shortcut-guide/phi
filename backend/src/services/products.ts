export async function fetchAllProducts() {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('商品取得に失敗しました');
  return res.json();
}