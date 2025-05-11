export interface ExternalAccount {
  id: string;                 // 外部アカウント連携ID（UUID）
  user_id: string;            // user_profiles.user_id と紐づく
  provider: string;           // 'paypal', 'google', 'line' など
  external_user_id: string;   // PayPal等のユーザーID
  access_token?: string;      // オプション（非必須）
  refresh_token?: string;     // オプション（非必須）
  expires_at?: string;        // ISO形式の有効期限
  linked_at: string;          // ISO日付形式
}