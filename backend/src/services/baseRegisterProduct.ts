import {BaseJancodeFindProducts} from "baseJancodeFindProduct";

export const baseRegisterProduct = async (jan: string, product: JanProduct) => {
  const existing = await BaseJancodeFindProducts(jan);
  const categoryId = await getOrCreateCategory(product.category);

  if (existing) {
    const [newDesc, count] = incrementSearchCount(existing.description);
    await fetch(`${BASE_API_URL}items/${existing.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${BASE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: newDesc,
        price: product.price || 0,
        category_id: categoryId,
      }),
    });

    return { ...existing, search_count: count };
  } else {
    const desc = `${product.name} by ${product.maker}\n検索回数: 1回`;

    const res = await fetch(`${BASE_API_URL}items`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${BASE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `${product.name} (${jan})`,
        description: desc,
        price: product.price || 0,
        category_id: categoryId,
        visible: true,
      }),
    });

    const data = await res.json();
    return { ...data, search_count: 1 };
  }
};