// backend/routes/shoplist.ts
import { Router } from "express";
import { getShopList } from "@/b/controllers/shopListController";

const router = Router();

router.get("/", (req, res) => {
  try {
    const lang = req.query.lang as string | undefined;
    //console.log("Fetching shop list for language:", lang);
    const shops = getShopList(lang);
    res.json(shops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "ショップリストデータの読み込みに失敗しました。" });
  }
});

export default router;
