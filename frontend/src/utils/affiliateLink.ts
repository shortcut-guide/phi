// frontend/src/utils/affiliateLink.ts
import React, { useEffect, useState } from "react";

type Shop = {
  domain: string;
  affiliate: {
    enabled: boolean;
    tagParam?: string;
    tagValue?: string;
  };
};

export function toAffiliateLink(url: string): string {
  try {
    const u = new URL(url);
    const matchedShop = (shopList as Shop[]).find(shop =>
      shop.domains.some(domain => u.hostname.endsWith(domain))
    );

    if (!matchedShop || !matchedShop.affiliate.enabled) return url;

    // 例: Amazon用
    if (matchedShop.affiliate.tagParam && matchedShop.affiliate.tagValue) {
      u.searchParams.set(matchedShop.affiliate.tagParam, matchedShop.affiliate.tagValue);
      return u.toString();
    }

    return url;
  } catch {
    return url;
  }
}
