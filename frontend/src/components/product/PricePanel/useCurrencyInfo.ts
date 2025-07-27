const currencyMap: Record<string, { symbol: string; label: string; code: string }> = {
  JP: { symbol: "¥", label: "JPY", code: "JPY" },
  US: { symbol: "$", label: "USD", code: "USD" },
  CN: { symbol: "元", label: "CNY", code: "CNY" },
  KR: { symbol: "₩", label: "KRW", code: "KRW" },
  EU: { symbol: "€", label: "EUR", code: "EUR" },
  GB: { symbol: "£", label: "GBP", code: "GBP" },
  JPY: { symbol: "¥", label: "JPY", code: "JPY" },
  USD: { symbol: "$", label: "USD", code: "USD" },
  CNY: { symbol: "元", label: "CNY", code: "CNY" },
  KRW: { symbol: "₩", label: "KRW", code: "KRW" },
  EUR: { symbol: "€", label: "EUR", code: "EUR" },
  GBP: { symbol: "£", label: "GBP", code: "GBP" },
};

export function useCurrencyInfo(countryCode?: string | null) {
  const defaultCurrency = { symbol: "¥", label: "JPY", code: "JPY" };

  if (!countryCode || (countryCode.length !== 2 && countryCode.length !== 3)) {
    return defaultCurrency;
  }

  const upperCode = countryCode.toUpperCase();
  if (currencyMap[upperCode]) {
    return currencyMap[upperCode];
  }

  // currencyMapにない場合はdefault
  return defaultCurrency;
}