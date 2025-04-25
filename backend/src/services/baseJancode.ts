import { BASE_API_URL, BASE_API_KEY } from '../config/baseConfig.ts';

interface JanProduct {
  name: string;
  maker: string;
  price?: number;
}

export const registerProductToBASE = async (product: JanProduct) => {
  const categoryId = await getJanCategoryId();

  const payload = {
    title: product.name,
    description: `${product.name} by ${product.maker}`,
    price: product.price ?? 0,
    category_id: categoryId,
    visible: true,
  };

  const res = await fetch(`${BASE_API_URL}items`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${BASE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`BASE商品登録失敗: ${error}`);
  }

  return await res.json();
};

const getJanCategoryId = async (): Promise<number> => {
  const res = await fetch(`${BASE_API_URL}categories`, {
    headers: {
      'Authorization': `Bearer ${BASE_API_KEY}`,
    },
  });
  const categories: { id: number; name: string }[] = await res.json();
  const janCategory = categories.find((c) => c.name === 'JAN検索商品');
  return janCategory?.id ?? 0;
};

export const findProductJancode = async (jan: string) => {
  const products: { title: string; description: string }[] = await (await fetch(`${BASE_API_URL}items`, {
    headers: {
      'Authorization': `Bearer ${BASE_API_KEY}`,
    },
  })).json();

  // 商品名 or 説明にJANを含めている前提
  return products.find((p: any) =>
    p.title.includes(jan) || p.description.includes(jan)
  );
};