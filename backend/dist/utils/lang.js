export function getLang() {
    // クエリパラメータ
    const urlLang = typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("lang")
        : null;
    if (urlLang === "ja" || urlLang === "en")
        return urlLang;
    // localStorage
    if (typeof localStorage !== "undefined") {
        const storedLang = localStorage.getItem("lang");
        if (storedLang === "ja" || storedLang === "en")
            return storedLang;
    }
    // ブラウザの言語設定
    if (typeof navigator !== "undefined") {
        const browserLang = navigator.language.slice(0, 2);
        if (browserLang === "ja" || browserLang === "en")
            return browserLang;
    }
    // デフォルト
    return "ja";
}
