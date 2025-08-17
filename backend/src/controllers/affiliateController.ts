import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { links } from "@/b/config/links";
import { generateJWT } from "@/b/utils/jwt";
import { getShopList } from "@/b/controllers/shopListController";

// 簡易的なクリック保存: Cloudflare D1 または実環境DBへ保存するロジックをここに実装してください。
// 現状はクリックをログに出力して、Amazonへリダイレクトするのみの実装。

function buildTrackingUrl(target: string, shopName: string) {
  try {
    const u = new URL(target);
    // shopListからtagParam/tagValueを探す
    const shops = getShopList();
    // shops は言語に紐づくため全言語から探す
    for (const lang of Object.keys(shops)) {
      const list: any = (shops as any)[lang];
      if (list && list[shopName] && list[shopName].affiliate && list[shopName].affiliate.enabled) {
        const cfg = list[shopName].affiliate;
        if (cfg.tagParam && cfg.tagValue) {
          u.searchParams.set(cfg.tagParam, cfg.tagValue);
          return u.toString();
        }
      }
    }
  } catch (e) {}
  return target;
}

export async function saveAffiliateClick(req: Request, res: Response) {
  try {
    const { target, lang, shop, asin } = req.query as Record<string, string>;
    if (!target) return res.status(400).json({ error: "target is required" });

    const clickId = uuidv4();
    const userJwt = req.cookies?.token || req.cookies?.jwt || null;
    // 本来はJWTを検証してuser_idを取得

    // TODO: DB保存ロジックを追加
    console.log("Affiliate click:", { clickId, target, lang, shop, asin, userJwt, ip: req.ip, ua: req.get("User-Agent") });

    // Amazon向けにtracking tagを付与してリダイレクト
    const redirectTarget = buildTrackingUrl(target, shop);
    res.redirect(redirectTarget);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: String(err?.message || err) });
  }
}
