import { BASE_API_KEY, BASE_API_URL } from '../config/baseConfig.ts';

export const BaseJancodeFindProducts = async (jan: string) => {
  const res = await fetch(`${BASE_API_URL}items`, {
    headers: { Authorization: `Bearer ${BASE_API_KEY}` },
  });

  const products: { title: string; description?: string }[] = await res.json();
  return products.find((p) => p.title.includes(jan)); // または description に JAN を含める
};