import { useMemo } from "react";

export function useTabbedKeys(ecData: Record<string, any>) {
  return useMemo(
    () =>
      Object.entries(ecData)
        .filter(
          ([, value]) =>
            value &&
            typeof value === "object" &&
            Object.values(value).every(
              (v) => v && typeof v === "object" && ("base_price" in v || "price" in v)
            )
        )
        .map(([key]) => key),
    [ecData]
  );
}
