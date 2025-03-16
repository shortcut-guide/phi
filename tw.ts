// Tailwind のクラスをテンプレートリテラルで管理するユーティリティ
export const tw = (strings: TemplateStringsArray, ...values: string[]) =>
  strings.flatMap((s, i) => [s, values[i] || ""]).join("").trim();