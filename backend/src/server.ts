// src/server.ts
import express from "express";
import { PaypalRoutes } from "@/b/routes/auth";
import faqRouter from "@/b/routes/faq";
import shopListRouter from "@/b/routes/shoplist";

const app = express();
const PORT = 3002;

app.use(express.json());
app.use("/api/auth/paypal", PaypalRoutes);
app.use("/api/faq", faqRouter);
app.use("/api/shopList", shopListRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running`);
});