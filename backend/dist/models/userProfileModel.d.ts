import type { UserProfile } from '@/b/types/userProfile';
export declare function getUserProfile(user_id: string): Promise<Record<string, unknown>[]>;
export declare function upsertUserProfile({ user_id, nickname, bio, avatar_url }: UserProfile): Promise<Record<string, unknown>[]>;
