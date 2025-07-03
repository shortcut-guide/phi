// src/server.ts
import express from "express";
import { PaypalRoutes } from "@/b/routes/auth";
import faqRouter from "@/b/routes/faq";

const app = express();
const PORT = 8787;

app.use(express.json());
app.use("/api/auth/paypal", PaypalRoutes);
app.use("/api/faq", faqRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});