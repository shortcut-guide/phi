export type Product = {
  id: string;
  name: string;
  description?: string;
  base_price?: number;
  price?: number;
  point?: number;
  ec_data?: EcData;
  // 必要に応じて拡張
  [key: string]: any;
};