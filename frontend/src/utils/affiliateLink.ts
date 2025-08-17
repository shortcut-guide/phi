// frontend/src/utils/affiliateLink.ts
import { fetchWithTimeout } from "@/f/utils/fetchTimeout";

type AffiliateConfig = {
  enabled: boolean;
  tagParam?: string;
  tagValue?: string;
};

type ShopDefinition = {
  domain: string;
  affiliate: AffiliateConfig;
};

type ShopListByLang = {
  [shopName: string]: ShopDefinition;
};

type ShopList = {
  [lang: string]: ShopListByLang;
};

type MatchResult = {
  lang: string;
  shopName: string;
  shop: ShopDefinition;
};

let cachedShopList: ShopList | null = null;

/**
 * shopListをAPIから取得しキャッシュ
 */
export async function fetchShopList(lang = "ja"): Promise<ShopList> {
  if (cachedShopList) return cachedShopList;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const res = await fetchWithTimeout(`${apiUrl}/api/shoplist?lang=${lang}`, 5000);
  if (!res.ok) throw new Error("Failed to fetch shop list");
  const json = await res.json();
  cachedShopList = json as ShopList;
  return cachedShopList;
}

/**
 * ドメイン一致するショップ定義を返す
 */
function matchShopDefinition(url: string, shopList: ShopList): MatchResult | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  for (const [lang, shops] of Object.entries(shopList)) {
    for (const [shopName, shop] of Object.entries(shops)) {
      if (shop.domain && u.hostname.endsWith(shop.domain)) {
        return { lang, shopName, shop };
      }
    }
  }
  return null;
}

/**
 * Amazon URLからASINを抽出
 */
function extractAmazonASIN(u: URL): string | null {
  // common patterns: /dp/ASIN, /gp/product/ASIN, ?ASIN=...
  const dp = u.pathname.match(/\/dp\/([A-Z0-9]{10})/i);
  if (dp) return dp[1];
  const gp = u.pathname.match(/\/gp\/product\/([A-Z0-9]{10})/i);
  if (gp) return gp[1];
  const q = u.searchParams.get('ASIN') || u.searchParams.get('asin');
  if (q && /^[A-Z0-9]{10}$/i.test(q)) return q;
  // sometimes the ASIN is the last path segment
  const last = u.pathname.split('/').filter(Boolean).pop();
  if (last && /^[A-Z0-9]{10}$/i.test(last)) return last;
  return null;
}

/**
 * アフィリエイトリンク変換
 * - Amazonは直接tagを付与せず、当サービスのリダイレクトAPI(/api/affiliate/redirect)を経由してクリックを記録
 * - その他は従来通りtagParam/tagValueを付与して返却
 */
export async function toAffiliateLink(url: string): Promise<string> {
  const shopList = await fetchShopList();
  const match = matchShopDefinition(url, shopList);
  if (!match) return url;

  const { shop, lang, shopName } = match;
  if (!shop.affiliate?.enabled || !shop.affiliate.tagParam || !shop.affiliate.tagValue) {
    return url;
  }
  try {
    const u = new URL(url);
    // Amazon系サイトは当サーバのリダイレクトAPI経由にする
    if (u.hostname.includes('amazon')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const asin = extractAmazonASIN(u);
      const redirectUrl = `${apiUrl}/api/affiliate/redirect?target=${encodeURIComponent(url)}&lang=${encodeURIComponent(lang)}&shop=${encodeURIComponent(shopName)}${asin ? `&asin=${encodeURIComponent(asin)}` : ''}`;
      return redirectUrl;
    }

    // それ以外は既存のtag付与を行う
    u.searchParams.set(shop.affiliate.tagParam, shop.affiliate.tagValue);
    return u.toString();
  } catch {
    return url;
  }
}