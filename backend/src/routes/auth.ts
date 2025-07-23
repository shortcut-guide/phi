import { Router, Request, Response } from "express";
import { handlePaypalCallback } from "@/b/controllers/paypalController";

const router = Router();

// POST
router.post("/callback", async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.body.code;
    if (!code) {
      res.status(400).json({ error: "code is required" });
      return;
    }

    const result = await handlePaypalCallback(code);
    res.cookie("token", result.jwt, { httpOnly: true, path: "/" });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET
router.get("/callback", async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.query.code as string;
    if (!code) {
      res.status(400).json({ error: "code is required" });
      return;
    }

    const result = await handlePaypalCallback(code);
    res.cookie("token", result.jwt, { httpOnly: true, path: "/" });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const PaypalRoutes = router;