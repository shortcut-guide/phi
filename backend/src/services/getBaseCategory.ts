/*
  - 大カテゴリ：JAN検索商品（固定）
	- 子カテゴリ：JAN検索APIの商品カテゴリ名
	- 既存に JAN検索商品 の子カテゴリがあれば再利用
	- なければ 新規に作成（同名でも別ID）
	- 既存カテゴリ（JAN以外） は対象外。移動や流用はしない。
	- 検索回数の記録：JANコードごとに検索回数をD1などに記録・更新し、商品情報に含める。
*/

import { BASE_API_URL, BASE_API_KEY } from '../config/baseConfig.js';

/**
 * BASE API からカテゴリを取得する
 */
const fetchCategories = async (): Promise<{ name: string; parent_id: number | null; id: number }[]> => {
  const res = await fetch(`${BASE_API_URL}categories`, {
    headers: { Authorization: `Bearer ${BASE_API_KEY}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`カテゴリ取得失敗: ${errText}`);
  }

  return await res.json();
};

/**
 * 子カテゴリを新規作成する
 */
const createChildCategory = async (childName: string, parentId: number): Promise<number> => {
  const res = await fetch(`${BASE_API_URL}categories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${BASE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: childName,
      parent_id: parentId,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`子カテゴリ作成失敗: ${errText}`);
  }

  const newCategory: { id: number } = await res.json();
  return newCategory.id;
};

/**
 * 子カテゴリ ID を取得する
 */
export const getBaseCategory = async (childName: string): Promise<number> => {
  const categories = await fetchCategories();

  // 親カテゴリ「JAN検索商品」を探す
  const parent = categories.find((c) => c.name === 'JAN検索商品' && !c.parent_id);
  if (!parent) throw new Error('親カテゴリ「JAN検索商品」が見つかりません');

  // 同名で「JAN検索商品」配下の子カテゴリが存在するか
  const existingChild = categories.find((c) => c.name === childName && c.parent_id === parent.id);
  if (existingChild) return existingChild.id;

  // 存在しない場合、新規作成
  return await createChildCategory(childName, parent.id);
};