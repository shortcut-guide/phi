export interface Product {
  id: string;
  name: string;
  shop_name: string;
  platform: string;
  base_price: number;
  ec_data: string; // JSON文字列（パースは必要に応じて）
  created_at?: string;
  updated_at?: string;
}