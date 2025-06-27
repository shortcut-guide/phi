import { Product } from "@/b/types/product";
export declare function getProducts(): Promise<D1Result<unknown> | Record<string, unknown>[]>;
export declare function createProduct(product: Product): Promise<D1Result<unknown> | Record<string, unknown>[]>;
export declare function updateProduct(product: Product): Promise<D1Result<unknown> | Record<string, unknown>[]>;
export declare function deleteProduct(id: string): Promise<D1Result<unknown> | Record<string, unknown>[]>;
export declare function getFilteredProducts({ id, name, shop_name, platform, base_price, ec_data, limit, }: {
    id?: string;
    name?: string;
    shop_name?: string;
    platform?: string;
    base_price?: number;
    ec_data?: any;
    limit?: number;
}): Promise<Record<string, unknown>[]>;
export declare function upsertProduct(product: Product): Promise<D1Result<unknown> | Record<string, unknown>[]>;
