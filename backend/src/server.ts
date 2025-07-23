import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PaypalRoutes } from "@/b/routes/auth";
import faqRouter from "@/b/routes/faq";

const app = express();
const PORT = 3002;

app.use(cors({
  origin: [
    "http://192.168.0.70:3001",
    "http://localhost:3001"
  ],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use("/auth", PaypalRoutes);
app.use("/api/faq", faqRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running`);
});