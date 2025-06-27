import type { Product } from "@/b/types/product";
export declare function fetchAllProducts(): Promise<unknown>;
export declare function parseAndValidateProduct(data: any, id?: string): Promise<Product>;
export declare function handleCreateProduct(request: Request): Promise<Response>;
export declare function handleUpdateProduct(request: Request, id?: string): Promise<Response>;
export declare function handleDeleteProduct(id?: string): Promise<Response>;
export declare function handleGetFilteredProducts(id?: string, name?: string, shop_name?: string, platform?: string, base_price?: number, ec_data?: any, limit?: number): Promise<Record<string, unknown>[]>;
