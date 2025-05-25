import { POST as createOrderHandler } from '@/b/api/paypal/createOrder';
import { createRequest } from 'node-mocks-http';

describe('createOrder API', () => {
  it('returns 403 for invalid CSRF token', async () => {
    const req = createRequest({
      method: 'POST',
      headers: {},
      body: {}
    });

    const res = await createOrderHandler({ request: req as any } as any);
    expect(res.status).toBe(403);
  });
});