// backend/routes/faq.ts
import { Router } from "express";
import { getFaqList } from "@/b/controllers/faqController";

const router = Router();

router.get("/", (req, res) => {
  try {
    const faqs = getFaqList();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: "FAQデータの読み込みに失敗しました。" });
  }
});

export default router;
