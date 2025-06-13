import { Product } from "@/b/types/product";
export declare function getProducts(): Promise<D1Result<unknown> | Product[]>;
export declare function createProduct(product: Product): Promise<D1Result<unknown> | Record<string, unknown>[]>;
export declare function updateProduct(product: Product): Promise<D1Result<unknown> | Record<string, unknown>[]>;
export declare function deleteProduct(id: string): Promise<D1Result<unknown> | Record<string, unknown>[]>;
export declare function getFilteredProducts({ shop, limit, ownOnly, }: {
    shop?: string;
    limit: number;
    ownOnly: boolean;
}): Promise<D1Result<unknown> | Product[]>;
export declare function upsertProduct(product: Product): Promise<D1Result<unknown> | Record<string, unknown>[]>;
