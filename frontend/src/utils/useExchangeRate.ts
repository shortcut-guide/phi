// frontend/src/hooks/useExchangeRate.ts
import { useState, useEffect } from "react";

type UseExchangeRateResult = {
  rate: number;
  isLoading: boolean;
  isError: boolean;
};

export function useExchangeRate(fromCurrency: string, toCurrency: string = "JPY"): UseExchangeRateResult {
  const [rate, setRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!fromCurrency || fromCurrency === toCurrency) {
      setRate(1);
      setIsLoading(false);
      setIsError(false);
      return;
    }
    setIsLoading(true);
    setIsError(false);

    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      .then((res) => res.json())
      .then((data) => {
        const rateValue = data.rates?.[toCurrency];
        if (typeof rateValue === "number") {
          setRate(rateValue);
          setIsError(false);
        } else {
          setRate(1);
          setIsError(true);
        }
      })
      .catch(() => {
        setRate(1);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fromCurrency, toCurrency]);

  return { rate, isLoading, isError };
}