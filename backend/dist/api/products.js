import { getFilteredProducts } from '@/b/models/ProductModel';
export async function handleGetProducts(c) {
    const shop = c.req.query('shop');
    const limit = Number(c.req.query('limit') ?? 100);
    const ownOnly = c.req.query('ownOnly') === 'true';
    const results = await getFilteredProducts(c.env, { shop, limit, ownOnly });
    return c.json(results);
}
