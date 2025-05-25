import { GET } from '@/b/api/pins';
import { createRequest } from 'node-mocks-http';

describe('pins API', () => {
  it('GET returns 200 with pin list', async () => {
    const req = createRequest({ method: 'GET' });
    const res = await GET({ request: req as any } as any);
    expect(res.status).toBe(200);
  });
});