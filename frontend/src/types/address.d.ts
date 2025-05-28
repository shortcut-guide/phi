export interface Address {
  id: string;
  name: string;
  kana?: string;
  zip: string;
  address: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  is_default?: boolean;
}