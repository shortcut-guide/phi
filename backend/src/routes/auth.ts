import { Router } from "express";
import { handlePaypalCallback } from "@/b/controllers/paypalController";

const router = Router();
router.post("/callback", async(req, res) => {
  try {
    const result = await handlePaypalCallback(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const PaypalRoutes = router;