import { useState } from "react";

export function useActiveTabs(tabbedKeys: string[], ecData: Record<string, any>) {
  const [activeTabs, setActiveTabs] = useState(
    Object.fromEntries(tabbedKeys.map((key) => [key, Object.keys(ecData[key])[0]]))
  );
  return [activeTabs, setActiveTabs] as const;
}
