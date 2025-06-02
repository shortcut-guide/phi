export function track(event: string, data = {}) {
  if (typeof window === "undefined") return;
  fetch("/api/analytics", {
    method: "POST",
    body: JSON.stringify({ event, data }),
    headers: { "Content-Type": "application/json" },
  });
}

export function trackGAEvent(event: string, params: Record<string, any> = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}