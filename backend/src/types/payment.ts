export interface PaymentMethod {
  user_id: string;
  method: string; // 例: "paypal", "mpay", "card", "docomo", etc.
  updated_at?: string;
}

export interface SavePaymentMethodInput {
  user_id: string;
  method: string;
}

export interface PaymentMethodResult {
  selectedMethod: string;
}