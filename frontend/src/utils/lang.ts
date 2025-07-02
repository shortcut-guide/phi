import { useEffect, useState } from "react";
export function getLang(): "ja" | "en" {
  // サーバーサイドならデフォルト返す
  if (typeof window === "undefined" || typeof navigator === "undefined" || typeof localStorage === "undefined") {
    return "ja";
  }
  // クエリパラメータ
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  if (urlLang === "ja" || urlLang === "en") return urlLang;

  // ブラウザの言語設定
  const browserLang = navigator.language.slice(0, 2);
  if (browserLang === "ja" || browserLang === "en") return browserLang;

  // localStorage
  const storedLang = localStorage.getItem("lang");
  if (storedLang === "ja" || storedLang === "en") return storedLang;

  // デフォルト
  return "ja";
}