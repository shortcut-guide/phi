import type { VerifyToken } from "@/b/types/verify";
export declare function updateVerifiedStatus(email: string): Promise<Record<string, unknown>[]>;
export declare function getVerifiedStatus(userId: string): Promise<boolean>;
export declare function insertVerifyToken(tokenId: string, userId: string, email: string): Promise<Record<string, unknown>[]>;
export declare function markUserAsVerified(email: string): Promise<Record<string, unknown>[]>;
export declare function getVerifyToken(tokenId: string): Promise<VerifyToken | null>;
export declare function deleteVerifyToken(tokenId: string): Promise<Record<string, unknown>[]>;
export declare function isVerificationExpired(userId: string, days: number): Promise<boolean>;
