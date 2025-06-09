import type { Address, AddressCount } from "@/b/types/address";
export declare function fetchAddresses(db: D1Database, user_id: string): Promise<Address[]>;
export declare function countAddresses(db: D1Database, user_id: string): Promise<AddressCount>;
export declare function setDefaultAddress(db: D1Database, user_id: string, address_id: string): Promise<void>;
export declare function insertAddress(db: D1Database, address: Address): Promise<void>;
