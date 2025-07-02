import { createContext, useContext, useEffect, useState } from "react";
import { getLang } from "@/f/utils/lang";
const LangContext = createContext<"ja" | "en">("ja");

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<"ja" | "en">("ja");
  useEffect(() => {
    setLang(getLang());
  }, []);
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}
export function useLang() {
  return useContext(LangContext);
}