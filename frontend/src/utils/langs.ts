// src/utils/lang.ts

export const SUPPORTED_LANGS = ["ja", "en"];
export const DEFAULT_LANG = "en";

export function detectLang(
  paramsLang?: string,
  reqLangHeader?: string
): string {
  // 1. URLパラメータ優先
  if (paramsLang && SUPPORTED_LANGS.includes(paramsLang)) return paramsLang;

  // 2. Accept-Languageヘッダー
  if (reqLangHeader) {
    const accept = reqLangHeader.split(",")[0].trim();
    const matched = SUPPORTED_LANGS.find(l => accept.startsWith(l));
    if (matched) return matched;
  }

  // 3. フォールバック
  return DEFAULT_LANG;
}
