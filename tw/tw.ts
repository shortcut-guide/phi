// Tailwind クラスをテンプレートリテラルとして扱う関数
export const tw = (strings: TemplateStringsArray, ...values: string[]): string =>
  strings.flatMap((s, i) => [s, values[i] || ""]).join("").trim();