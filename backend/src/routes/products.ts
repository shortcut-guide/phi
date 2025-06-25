import { Hono } from 'hono';
import { handleGetProducts } from '@/b/api/products';

export const productRoutes = new Hono();

productRoutes.get('/', handleGetProducts);
console.log(productRoutes.router.match('GET','/'));