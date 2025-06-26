import type { Product } from "@/b/types/product";
export declare function fetchAllProducts(): Promise<unknown>;
export declare function parseAndValidateProduct(data: any, id?: string): Promise<Product>;
export declare function handleCreateProduct(request: Request): Promise<Response>;
export declare function handleUpdateProduct(request: Request, id?: string): Promise<Response>;
export declare function handleDeleteProduct(id?: string): Promise<Response>;
export declare function handleGetFilteredProducts(shop?: string, limit?: number): Promise<Product[]>;
