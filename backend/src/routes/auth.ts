import { Router, Request, Response } from "express";
import { handlePaypalCallback } from "@/b/controllers/paypalController";

const router = Router();

const callbackHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.query.code as string;
    const stateRaw = req.query.state as string;
    if (!code) {
      res.status(400).json({ error: "code is required" });
      return;
    }
    let redirectTo = "/";
    if (stateRaw) {
      try {
        const state = JSON.parse(decodeURIComponent(stateRaw));
        // ここで絶対URLかどうか判定し、そのままリダイレクト
        if (state.redirectTo && typeof state.redirectTo === "string") {
          redirectTo = state.redirectTo;
        }
      } catch {}
    }
    const result = await handlePaypalCallback(code);
    res.cookie("token", result.jwt, { httpOnly: true, path: "/" });
    res.redirect(redirectTo);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

router.post("/callback", callbackHandler);
router.get("/callback", callbackHandler);

export const PaypalRoutes = router;