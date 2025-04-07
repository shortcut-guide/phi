const { calculateShippingCost } = require('../services/shippingCalculator');

describe('calculateShippingCost', () => {
    it('should calculate cost for known destination', () => {
        const product = { weight: 2.0 };
        const cost = calculateShippingCost(product, 'Japan');
        expect(cost).toBeGreaterThan(0);
    });

    it('should handle zero weight', () => {
        const product = { weight: 0 };
        const cost = calculateShippingCost(product, 'USA');
        expect(cost).toBeGreaterThanOrEqual(0);
    });

    it('should return consistent value', () => {
        const product = { weight: 1.5 };
        const cost1 = calculateShippingCost(product, 'Japan');
        const cost2 = calculateShippingCost(product, 'Japan');
        expect(cost1).toBe(cost2);
    });
});