import { Router } from "express";
import { handlePaypalCallback } from "@/b/controllers/paypalController";

const router = Router();
router.post("/callback", async(req, res) => {
  try {
    const result = await handlePaypalCallback({ code: req.body.code });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/callback", async(req, res) => {
  try {
    const result = await handlePaypalCallback({ code: req.body.code });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const PaypalRoutes = router;