export function getOrCreateCsrfToken(storageKey = "paypal_oauth_csrf"): string {
  if (typeof window === "undefined") return "";
  try {
    const s = window.sessionStorage.getItem(storageKey);
    if (s && s.length > 16) return s;
    const token = createRandomToken();
    window.sessionStorage.setItem(storageKey, token);
    return token;
  } catch {
    return createRandomToken();
  }
}

function createRandomToken(): string {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const arr = new Uint8Array(32);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}