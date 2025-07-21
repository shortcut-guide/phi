import { getAllInfoByISO } from "iso-country-currency";

export function useCurrencyInfo(countryCode?: string | null) {
  if (!countryCode || countryCode.length !== 2) return { symbol: "$", label: "USD" };
  try {
    const info = getAllInfoByISO(countryCode.toUpperCase());
    return {
      symbol: info?.symbol ?? "$",
      label: info?.currency ?? "USD",
    };
  } catch {
    return { symbol: "$", label: "USD" };
  }
}
