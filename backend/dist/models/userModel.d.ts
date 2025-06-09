import type { UserProfile } from '@/b/types/userProfile';
export declare function isUserVerified(DB: D1Database, { user_id }: UserProfile): Promise<boolean>;
