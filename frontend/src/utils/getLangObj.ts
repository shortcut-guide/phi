export function getLangObj<T = any>(obj: any, lang?: string): T {
  if (
    lang &&
    obj &&
    typeof obj === 'object' &&
    Object.prototype.hasOwnProperty.call(obj, lang)
  ) {
    return obj[lang];
  }
  return obj;
}