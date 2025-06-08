import { Hono } from 'hono';
import { handleGetProducts } from '@/b/api/products';
const productRoutes = new Hono();
productRoutes.get('/products', handleGetProducts);
export default productRoutes;
