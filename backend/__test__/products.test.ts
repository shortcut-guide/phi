import fetchMock from 'jest-fetch-mock';
import app from '@/b/api/products';

describe('GET /api/products', () => {
  const mockResults = [
    {
      id: 'abc123',
      title: '商品A',
      price: 1200,
      shop_name: '自社',
      site_name: '楽天',
      updated_at: '2024-05-01T00:00:00Z'
    }
  ];

  const mockDB = {
    prepare: () => ({
      bind: (..._args: any[]) => ({
        all: async () => ({ results: mockResults })
      })
    })
  };

  it('should return product list', async () => {
    const req = new Request('http://localhost/api/products?ownOnly=true');
    const res = await app.fetch(req, { DB: mockDB } as any); // ✅ .fetch + Bindings対応
    const json = await res.json() as any[];

    expect(res.status).toBe(200);
    expect(Array.isArray(json)).toBe(true);
    expect(json).toEqual(mockResults);
  });

  it('should filter by shop name', async () => {
    const req = new Request('http://localhost/api/products?shop=楽天');
    const res = await app.fetch(req, { DB: mockDB } as any);
    const json = await res.json() as any[];

    expect(res.status).toBe(200);
    expect(json[0].site_name).toBe('楽天');
  });
});