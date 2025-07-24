import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
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

router.post("/paypal/callback", callbackHandler);
router.get("/paypal/callback", callbackHandler);

// 認証状態取得API
router.get("/me", (req: Request, res: Response) => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    res.json(payload);
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// ログアウトAPI
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token", { path: "/" });
  res.json({ success: true });
});

export const PaypalRoutes = router;