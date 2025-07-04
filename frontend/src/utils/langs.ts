export const SUPPORTED_LANGS = ['ja', 'en'];

// 単純な言語分岐パス
export async function getStaticPaths() {
  return SUPPORTED_LANGS.map(lang => ({ params: { lang } }));
}

// 各言語ごとに任意ロジックを合成
export async function generateLangStaticPaths<T>(
  perLang: (lang: string) => Promise<T[]>
): Promise<T[]> {
  let all: T[] = [];
  for (const lang of SUPPORTED_LANGS) {
    const perPage = await perLang(lang);
    all = all.concat(perPage);
  }
  return all;
}