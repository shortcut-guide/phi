import { handleGetPayment, handleSetPayment } from "@/b/controllers/paymentController";
export const onRequestGet = handleGetPayment;
export const onRequestPost = handleSetPayment;
