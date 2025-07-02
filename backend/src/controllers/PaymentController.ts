import { getCaptureOrder } from "@/b/services/captureOrder";
import { getPaymentCapture } from "@/b/services/getPayment";
export async function handleGetPayment() {
  return await getPaymentCapture();
}

export async function handleGetCaptureOrder(context: any) {
  return await getCaptureOrder(context.request, context.response);
}