export interface Product {
  id: string;
  name: string;
  shop_name: string;
  platform: string;
  base_price: number;
  ec_data: string;
  created_at?: string;
  updated_at?: string;
}