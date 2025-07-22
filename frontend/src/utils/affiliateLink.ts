// frontend/src/utils/affiliateLink.ts

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
export async function fetchShopList(): Promise<ShopList> {
  if (cachedShopList) return cachedShopList;
  const res = await fetch("/api/shoplist");
  if (!res.ok) throw new Error("Failed to fetch shop list");
  const json = await res.json();
  cachedShopList = json.data as ShopList;
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
 * アフィリエイトリンク変換
 * - shopListの定義に従い、該当ドメインならパラメータ付与
 * - enabled=falseや該当なしは元URL
 */
export async function toAffiliateLink(url: string): Promise<string> {
  const shopList = await fetchShopList();
  const match = matchShopDefinition(url, shopList);
  if (!match) return url;

  const { shop } = match;
  if (!shop.affiliate?.enabled || !shop.affiliate.tagParam || !shop.affiliate.tagValue) {
    return url;
  }
  try {
    const u = new URL(url);
    u.searchParams.set(shop.affiliate.tagParam, shop.affiliate.tagValue);
    return u.toString();
  } catch {
    return url;
  }
}
