export type EcData = {
  images?: string[] | Record<string, any>;
  description?: string;
  rating?: number;
  review_count?: number;
  review_link?: string;
  url?: string;
  country?: string;
  category?: string[];
  size?: string | number | Record<string, any>;
  [key: string]: any;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  base_price?: number;
  price?: number;
  point?: number;
  ec_data?: EcData;
  [key: string]: any;
};