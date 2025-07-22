import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PaypalRoutes } from "@/b/routes/auth";
import paypalOrderRoute from "@/b/routes/paypalOrderRoute";
import faqRouter from "@/b/routes/faq";
import shopListRouter from "@/b/routes/shoplist";

const app = express();
const PORT = 3002;

// 複数origin許可
const whitelist = [
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://192.168.0.70:3001"
  "http://localhost:3002",
  "http://127.0.0.1:3002",
  "http://192.168.0.70:3002"
];

app.use(cors({
  origin: function(origin, callback) {
    // CORS preflight（OPTIONS）では origin===undefined になるので許可
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use("/auth", PaypalRoutes);
app.use("/api/paypal/order", paypalOrderRoute);
app.use("/api/faq", faqRouter);
app.use("/api/shopList", shopListRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});