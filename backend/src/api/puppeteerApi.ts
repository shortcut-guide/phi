import express from "express";
import puppeteerController from "../controllers/puppeteerController";

const router = express.Router();

router.post("/upload", puppeteerController.uploadJson);
router.get("/data", puppeteerController.getData);
router.put("/data/:id", puppeteerController.updateData);
router.delete("/data/:id", puppeteerController.deleteData);

export default router;