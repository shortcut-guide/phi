import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { links } from "@/b/config/links";
import { generateJWT } from "@/b/utils/jwt";
import { getShopList } from "@/b/controllers/shopListController";

// 簡易的なクリック保存: Cloudflare D1 または実環境DBへ保存するロジックをここに実装してください。
// 現状はクリックをログに出力して、Amazonへリダイレクトするのみの実装。

function buildTrackingInfo(target: string, shopName: string) {
  try {
    const u = new URL(target);
    let trackingId: string | null = null;
    // shopListからtagParam/tagValueを探す
    const shops = getShopList();
    // shops は言語に紐づくため全言語から探す
    for (const lang of Object.keys(shops)) {
      const list: any = (shops as any)[lang];
      for (const [key, val] of Object.entries(list)) {
        if (key.toLowerCase() === shopName.toLowerCase() && val?.affiliate?.enabled) {
          const cfg = (val as any).affiliate;
          if (cfg.tagParam && cfg.tagValue) {
            u.searchParams.set(cfg.tagParam, cfg.tagValue);
            trackingId = cfg.tagValue;
            return { url: u.toString(), tracking_id: trackingId };
          }
        }
      }
    }
  } catch (e) {}
  return { url: target, tracking_id: null };
}

export async function saveAffiliateClick(req: Request, res: Response) {
  try {
    const { target, lang, shop, asin } = req.query as Record<string, string>;
    if (!target) return res.status(400).json({ error: "target is required" });

    const clickId = uuidv4();
    const userJwt = req.cookies?.token || req.cookies?.jwt || null;
    // 本来はJWTを検証してuser_idを取得

    // ログ出力
    console.log("Affiliate click:", { clickId, target, lang, shop, asin, userJwt, ip: req.ip, ua: req.get("User-Agent") });

    // トラッキング付きURLとtracking_idを組み立て
    const { url: redirectTarget, tracking_id } = buildTrackingInfo(target, shop);

    // 永続化: 管理WorkerへPOSTしてD1に保存する（WorkerのURLとトークンは環境変数で指定）
    const workerUrl = process.env.AFFILIATE_WORKER_URL || process.env.AFFILIATE_URL || "http://localhost:8787";
    const workerToken = process.env.AFFILIATE_WORKER_TOKEN || process.env.WORKER_ADMIN_TOKEN || null;
    const payload = {
      id: clickId,
      user_id: null, // JWT検証があればここで user_id を埋める
      asin: asin || null,
      shop: shop || null,
      tracking_id: tracking_id,
      target_url: redirectTarget,
      referer: req.get("Referer") || null,
      ip: req.ip || null,
      user_agent: req.get("User-Agent") || null,
      meta: { lang: lang || null },
    };

    if (workerUrl) {
      try {
        const headers: any = { "Content-Type": "application/json" };
        if (workerToken) headers["Authorization"] = `Bearer ${workerToken}`;
        // Node の global fetch を想定
        const r = await fetch(`${workerUrl.replace(/\/$/, "")}/affiliate/click`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        if (!r.ok) {
          console.warn("Failed to persist affiliate click to worker", await r.text());
        }
      } catch (e) {
        console.warn("Error posting affiliate click to worker:", String(e));
      }
    }

    // Amazon向けにtracking tagを付与してリダイレクト
    res.redirect(redirectTarget);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: String(err?.message || err) });
  }
}
