// frontend/src/utils/affiliateLink.ts

let cachedShopList: any = null;

/**
 * shopListをAPIから取得・キャッシュ
 */
export async function fetchShopList(): Promise<any> {
  if (cachedShopList) return cachedShopList;
  const res = await fetch('/api/shoplist'); // 適宜修正
  if (!res.ok) return {};
  const json = await res.json();
  cachedShopList = json.data || {};
  return cachedShopList;
}

/**
 * ドメイン→言語・ショップ情報を動的判定
 * @param url 
 * @param shopList APIから取得したshopList
 * @returns { lang, shopDef } or null
 */
function getShopDefinition(url: string, shopList: any): { lang: string, shopName: string, shopDef: any } | null {
  try {
    const u = new URL(url);

    // 全言語・全ショップでループ
    for (const lang of Object.keys(shopList)) {
      const shops = shopList[lang];
      for (const shopName of Object.keys(shops)) {
        const shopDef = shops[shopName];
        if (shopDef.domain && u.hostname.endsWith(shopDef.domain)) {
          return { lang, shopName, shopDef };
        }
      }
    }
  } catch {}
  return null;
}

/**
 * 商品リンクをアフィリエイトリンクに変換（全てshopListの内容に準拠）
 * @param url 商品リンクURL
 * @returns 変換後URL（非同期: Promise<string>）
 */
export async function toAffiliateLink(url: string): Promise<string> {
  try {
    const shopList = await fetchShopList();
    const shopDefInfo = getShopDefinition(url, shopList);
    if (!shopDefInfo) return url;

    const { shopDef } = shopDefInfo;
    const u = new URL(url);

    if (shopDef.affiliate?.enabled && shopDef.affiliate?.tagParam && shopDef.affiliate?.tagValue) {
      u.searchParams.set(shopDef.affiliate.tagParam, shopDef.affiliate.tagValue);
      return u.toString();
    }
    return url;
  } catch {
    return url;
  }
}