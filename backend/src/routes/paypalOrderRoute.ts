import express from "express";
import { createOrder, captureOrder } from "@/b/controllers/paypalOrderController";

const router = express.Router();

router.post("/", createOrder);
router.post("/:orderId", captureOrder);

export default router;