export interface PaymentMethod {
    user_id: string;
    method: string;
    updated_at?: string;
}
export interface SavePaymentMethodInput {
    user_id: string;
    method: string;
}
export interface PaymentMethodResult {
    selectedMethod: string;
}
