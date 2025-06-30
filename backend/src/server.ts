// src/server.ts
import express from "express";
import { PaypalRoutes } from "@/b/routes/auth";

const app = express();
const PORT = 8787;

app.use(express.json());
app.use("/api/auth/paypal/callback", PaypalRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});