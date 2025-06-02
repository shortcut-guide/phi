export interface UserProfile {
  user_id: string;         // 内部UUID
  nickname: string | null; // 表示名（任意）
  bio: string | null;      // 自己紹介（任意）
  avatar_url: string | null; // プロフィール画像URL（任意）
  updated_at: string;      // ISO日付文字列
}