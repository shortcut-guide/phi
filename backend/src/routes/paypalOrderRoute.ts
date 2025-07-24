// backend/routes/paypalOrderRoute.ts
import express from "express";
import { createOrder, captureOrder } from "../controllers/paypalOrderController";

const router = express.Router();

router.post("/paypal/create-order", createOrder);
router.post("/paypal/capture-order/:orderId", captureOrder);

export default router;
