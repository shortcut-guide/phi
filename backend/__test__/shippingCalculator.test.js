import {
    calculateYamatoShippingCost,
    calculateSagawaShippingCost,
    calculateEMSShippingCost,
    calculateOCSShippingCost
  } from '../src/utils/shippingCalculator.js';
  
  describe('Shipping Cost Calculations', () => {
    const testCases = [
        {
            description: 'ヤマト運輸: 実重量が容積重量より大きい場合',
            func: calculateYamatoShippingCost,
            weight: 2,
            length: 20,
            width: 20,
            height: 15,
            expected: 181
          },
          {
            description: '佐川急便: 実重量が容積重量より小さい場合',
            func: calculateSagawaShippingCost,
            weight: 0.3,
            length: 50,
            width: 40,
            height: 20,
            expected: 101
          },
          {
            description: 'EMS: 基本重量内の場合',
            func: calculateEMSShippingCost,
            weight: 0.5,
            length: 10,
            width: 10,
            height: 10,
            expected: 88
          },
          {
            description: 'OCS: 追加重量が発生する場合',
            func: calculateOCSShippingCost,
            weight: 1.2,
            length: 25,
            width: 25,
            height: 25,
            expected: 49
          }
    ];
  
    testCases.forEach(({ description, func, weight, length, width, height, expected }) => {
        test(description, async () => {
            const cost = await func(weight, length, width, height);
            expect(cost).toBe(expected);
        });
    });
  });