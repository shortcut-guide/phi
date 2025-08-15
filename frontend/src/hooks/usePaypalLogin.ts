"use client";

import { getOrCreateCsrfToken } from "@/f/utils/csrf";
import { detectLangFromPath, mergeQuery, resolveApiBase, toAbsoluteUrl } from "@/f/utils/url";
import type { PaypalLoginOptions, PaypalLoginResult } from "@/f/types/auth";

type Status = "idle" | "building" | "redirecting" | "error";

export function usePaypalLogin(opts?: PaypalLoginOptions) {
  const statusRef: { current: Status } = { current: "idle" };
  let lastError: unknown = null;

  function buildAuthUrl(): PaypalLoginResult {
    statusRef.current = "building";
    const lang = opts?.lang || detectLangFromPath("ja");
    const apiBase = resolveApiBase();
    const authPath = (opts?.authPath || "/auth/paypal").replace(/\/+$/, "");
    const successPath = opts?.successPath || `/${lang}/paypal/success`;
    const cancelPath = opts?.cancelPath || `/${lang}/paypal/cancel`;
    const returnUrl = toAbsoluteUrl(successPath);
    const cancelUrl = toAbsoluteUrl(cancelPath);
    const csrf = getOrCreateCsrfToken();
    const base = `${apiBase}${authPath}`;
    const state: Record<string, string> = {
      csrf,
      lang,
      ...(opts?.source ? { source: String(opts.source) } : {}),
    };
    if (opts?.stateExtra) {
      Object.entries(opts.stateExtra).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        state[k] = String(v);
      });
    }
    const url = mergeQuery(base, {
      return_url: returnUrl,
      cancel_url: cancelUrl,
      lang,
      scope: opts?.scope || "openid profile email",
      client_id: opts?.clientId || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
      state: encodeURIComponent(JSON.stringify(state)),
    });
    statusRef.current = "idle";
    return { url };
  }

  async function login(): Promise<void> {
    try {
      const { url } = buildAuthUrl();
      statusRef.current = "redirecting";
      if (typeof window !== "undefined") window.location.href = url;
    } catch (e) {
      lastError = e;
      statusRef.current = "error";
      throw e;
    }
  }

  function getStatus(): Status {
    return statusRef.current;
  }

  function getError(): unknown {
    return lastError;
  }

  return { buildAuthUrl, login, getStatus, getError };
}