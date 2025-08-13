// frontend/src/utils/localePath.ts
export const localePath = (lang: string | undefined, path: string): string => {
  const locale = typeof lang === "string" && lang ? `/${lang}` : "";
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${locale}${p}`.replace("//", "/");
};