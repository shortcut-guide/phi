const axios = require('axios');
const { getProductDetails } = require('../services/taobaoApiService');

jest.mock('axios');

describe('getProductDetails', () => {
    it('should return product details from API', async () => {
        const mockResponse = { data: { item: { weight: 1.0, title: 'Test Item' } } };
        axios.get.mockResolvedValue(mockResponse);

        const product = await getProductDetails('123');
        expect(product).toEqual(mockResponse.data);
    });

    it('should throw error if API fails', async () => {
        axios.get.mockRejectedValue(new Error('API Error'));

        await expect(getProductDetails('123')).rejects.toThrow('API Error');
    });
});