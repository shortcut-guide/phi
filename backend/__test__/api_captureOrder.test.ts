import { POST as captureOrderHandler } from '@/b/api/paypal/captureOrder';
import { createRequest } from 'node-mocks-http';

describe('captureOrder API', () => {
  it('returns 403 for invalid CSRF token', async () => {
    const req = createRequest({
      method: 'POST',
      headers: {},
      body: {}
    });

    const res = await captureOrderHandler({ request: req as any } as any);
    expect(res.status).toBe(403);
  });
});