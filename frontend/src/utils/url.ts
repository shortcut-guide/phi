export function toAbsoluteUrl(pathOrUrl: string, origin?: string): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  if (!base) return pathOrUrl;
  if (pathOrUrl.startsWith("/")) return base + pathOrUrl;
  return base + "/" + pathOrUrl;
}

export function mergeQuery(url: string, params: Record<string, string | number | null | undefined>): string {
  const u = new URL(toAbsoluteUrl(url, typeof window !== "undefined" ? window.location.origin : undefined));
  Object.entries(params).forEach(([k, v]) => {
    if (v === null || v === undefined || v === "") return;
    u.searchParams.set(k, String(v));
  });
  return u.toString();
}

export function detectLangFromPath(defaultLang = "ja"): string {
  if (typeof window === "undefined") return defaultLang;
  const seg = window.location.pathname.split("/").filter(Boolean)[0];
  if (!seg) return defaultLang;
  if (/^[a-z]{2}(-[A-Z]{2})?$/.test(seg)) return seg;
  return defaultLang;
}

export function resolveApiBase(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");
  if (typeof window === "undefined") return env || "";
  const origin = window.location.origin.replace(/\/+$/, "");
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
  if (isLocal && env) return env;
  return env || origin;
}