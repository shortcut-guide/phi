const request = require('supertest');
const express = require('express');
const router = require('../controllers/shippingController');
const taobaoService = require('../services/taobaoApiService');
const shippingCalculator = require('../services/shippingCalculator');

jest.mock('../services/taobaoApiService');
jest.mock('../services/shippingCalculator');

const app = express();
app.use(express.json());
app.use('/', router);

describe('POST /calculate-shipping', () => {
    it('should return 400 if productId or destination is missing', async () => {
        const res = await request(app).post('/calculate-shipping').send({});
        expect(res.status).toBe(400);
    });

    it('should return 404 if product not found', async () => {
        taobaoService.getProductDetails.mockResolvedValue(null);
        const res = await request(app)
            .post('/calculate-shipping')
            .send({ productId: '123', destination: 'Japan' });

        expect(res.status).toBe(404);
    });

    it('should return cost if inputs are valid', async () => {
        taobaoService.getProductDetails.mockResolvedValue({ weight: 1.2 });
        shippingCalculator.calculateShippingCost.mockReturnValue(1500);

        const res = await request(app)
            .post('/calculate-shipping')
            .send({ productId: '123', destination: 'Japan' });

        expect(res.status).toBe(200);
        expect(res.body.cost).toBe(1500);
    });

    it('should return 500 on exception', async () => {
        taobaoService.getProductDetails.mockImplementation(() => {
            throw new Error('Unexpected Error');
        });

        const res = await request(app)
            .post('/calculate-shipping')
            .send({ productId: '123', destination: 'Japan' });

        expect(res.status).toBe(500);
    });
});