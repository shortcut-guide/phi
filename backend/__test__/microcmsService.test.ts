import { fetchSearchRecord, upsertSearchRecord } from '../src/services/microcmsService';
import { MICROCMS_ENDPOINT, MICROCMS_API_KEY_TRACKING } from '../src/config/microcmsConfig';
import fetchMock from 'jest-fetch-mock';

// jest.spyOnでDateをモック
beforeAll(() => {
  jest.spyOn(Date, 'now').mockReturnValue(new Date('2025-04-18T00:00:00.000Z').getTime());
});

afterAll(() => {
  (Date.now as jest.Mock).mockRestore();
});

jest.mock('dayjs', () => {
  const actualDayjs = jest.requireActual('dayjs');
  return () => actualDayjs('2025-04-18'); // 固定日付を使用
});

fetchMock.mockResponses(
  ['', { status: 404 }], // fetchSearchRecord returns 404
  [JSON.stringify({ id: '1234567890123', createdAt: '2025-04-18T00:00:00Z' }), { status: 200 }] // upsert response
);

describe('microcmsService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchSearchRecord', () => {
    it('should return a search record when the API responds with data', async () => {
      const mockResponse = {
        searchStats: {
          totalYearly: 10,
          totalMonthly: 5,
          daily: { '2025-04-18': 2 },
          locations: { Tokyo: 3 },
        },
        searchCount: 15,
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const jan = '1234567890123';
      const result = await fetchSearchRecord(jan);

      expect(fetchMock).toHaveBeenCalledWith(`${MICROCMS_ENDPOINT}/${jan}`, {
        headers: { 'X-API-KEY': MICROCMS_API_KEY_TRACKING },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should return null when the API responds with a 404', async () => {
      fetchMock.mockResponseOnce('', { status: 404 });

      const jan = '1234567890123';
      const result = await fetchSearchRecord(jan);

      expect(result).toBeNull();
    });
  });

  describe('upsertSearchRecord', () => {
    it('should create a new search record when no existing record is found', async () => {
      fetchMock.mockResponses(
        ['', { status: 404 }], // fetchSearchRecord returns 404
        [JSON.stringify({ id: '1234567890123', createdAt: '2025-04-18T00:00:00Z' }), { status: 200 }] // upsert response
      );
  
      const jan = '1234567890123';
      const baseItemId = 'item123';
      const productName = 'Test Product';
      const location = 'Tokyo';
  
      const result = await upsertSearchRecord(jan, baseItemId, productName, location);
  
      // fetchSearchRecordの呼び出し
      expect(fetchMock).toHaveBeenCalledWith(`${MICROCMS_ENDPOINT}/${jan}`, {
        headers: { 'X-API-KEY': MICROCMS_API_KEY_TRACKING },
      });
  
      // 新規作成(POST)の呼び出し
      expect(fetchMock).toHaveBeenCalledWith(MICROCMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'X-API-KEY': MICROCMS_API_KEY_TRACKING,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: jan,
          jan,
          baseItemId,
          name: productName,
          searchCount: 1,
          lastSearchedAt: '2025-04-18T00:00:00.000Z',
          searchStats: {
            totalYearly: 1,
            totalMonthly: 1,
            daily: { '2025-04-18': 1 },
            locations: { Tokyo: 1 },
          },
        }),
      });
  
      expect(result).toEqual({ id: '1234567890123', createdAt: '2025-04-18T00:00:00Z' });
    });
  
    it('should update an existing search record', async () => {
      const existingRecord = {
        searchStats: {
          totalYearly: 10,
          totalMonthly: 5,
          daily: { '2025-04-18': 2 },
          locations: { Tokyo: 3 },
        },
        searchCount: 15,
      };
  
      fetchMock.mockResponses(
        [JSON.stringify(existingRecord), { status: 200 }], // fetchSearchRecord returns existing record
        [JSON.stringify({ id: '1234567890123', updatedAt: '2025-04-18T00:00:00Z' }), { status: 200 }] // upsert response
      );
  
      const jan = '1234567890123';
      const baseItemId = 'item123';
      const productName = 'Test Product';
      const location = 'Tokyo';
  
      const result = await upsertSearchRecord(jan, baseItemId, productName, location);
  
      // fetchSearchRecordの呼び出し
      expect(fetchMock).toHaveBeenCalledWith(`${MICROCMS_ENDPOINT}/${jan}`, {
        headers: { 'X-API-KEY': MICROCMS_API_KEY_TRACKING },
      });
  
      // 更新(put)の呼び出し
      expect(fetchMock).toHaveBeenCalledWith(`${MICROCMS_ENDPOINT}/${jan}`, {
        method: 'PUT',
        headers: {
          'X-API-KEY': MICROCMS_API_KEY_TRACKING,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: jan,
          jan,
          baseItemId,
          name: productName,
          searchCount: 16,
          lastSearchedAt: '2025-04-18T00:00:00.000Z',
          searchStats: {
            totalYearly: 11,
            totalMonthly: 6,
            daily: { '2025-04-18': 3 },
            locations: { Tokyo: 4 },
          },
        }),
      });
  
      expect(result).toEqual({ id: '1234567890123', updatedAt: '2025-04-18T00:00:00Z' });
    });
  });
});