import { handleGetPayment, handleSetPayment } from "@/b/controllers/PaymentController";

export const onRequestGet = handleGetPayment;
export const onRequestPost = handleSetPayment;
