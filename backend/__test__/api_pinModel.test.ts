import { getPins } from '@/b/models/pinModel';
import type { D1Database } from '@cloudflare/workers-types';

describe('pinModel', () => {
  const mockDB = {
    prepare: jest.fn().mockReturnThis(),
    bind: jest.fn().mockReturnThis(),
    run: jest.fn().mockResolvedValue({}),
    all: jest.fn().mockResolvedValue({ results: [] })
  } as unknown as D1Database;

  it('getPins returns array', async () => {
    const result = await getPins(mockDB);
    expect(result).toEqual([]);
  });
});