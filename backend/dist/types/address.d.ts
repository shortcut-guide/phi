export interface Address {
    id: string;
    user_id?: string;
    name: string;
    kana: string;
    zip: string;
    address: string;
    is_default: number;
    created_at?: string;
}
export interface CreateAddressInput {
    user_id?: string;
    name: string;
    kana: string;
    zip: string;
    address: string;
}
export interface UpdateAddressInput {
    id: string;
    name?: string;
    kana?: string;
    zip?: string;
    address?: string;
    is_default?: number;
}
export interface SetDefaultAddressInput {
    user_id: string;
    address_id: string;
}
export interface AddressCount {
    count: number;
}
