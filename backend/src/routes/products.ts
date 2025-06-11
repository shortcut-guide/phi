import { Hono } from 'hono';
import { handleGetProducts } from '@/b/api/products';

export const productRoutes = new Hono();

productRoutes.get('/products', handleGetProducts);