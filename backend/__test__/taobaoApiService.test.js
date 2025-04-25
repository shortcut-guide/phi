import { axiosMock, mockPost } from '../__mocks__/axiosMock.js';

const axios = await axiosMock();
const getProductDetails = (await import('../src/services/taobaoApiService.js')).default;

describe('getProductDetails', () => {
    it('should return product details from API', async () => {
        const mockResponse = { data: { item: { weight: 1.0, title: 'Test Item' } } };
        mockPost.mockResolvedValue(mockResponse); // axios.post をモック

        const product = await getProductDetails('123');
        expect(product).toEqual(mockResponse.data);
    });

    it('should throw error if API fails', async () => {
        mockPost.mockRejectedValue(new Error('API Error')); // axios.post をモック

        await expect(getProductDetails('123')).rejects.toThrow('API Error');
    });
});