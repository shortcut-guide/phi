import express from "express";
import { saveAffiliateClick } from "@/b/controllers/affiliateController";

const router = express.Router();

// GET /api/affiliate/redirect?target=...&lang=...&shop=...&asin=...
router.get("/redirect", (req, res, next) => {
  Promise.resolve(saveAffiliateClick(req, res)).catch(next);
});

export default router;
