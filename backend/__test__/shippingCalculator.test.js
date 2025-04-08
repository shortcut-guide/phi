import calculateShippingCost from '../src/utils/shippingCalculator.js';

describe('calculateShippingCost', () => {
  it('東京・標準配送・1kg・1000cm³ → 正常計算', () => {
    const result = calculateShippingCost({
      weight: 1,
      volume: 1000,
      destination: '東京',
      express: false,
    });
    // base: 600, weight: 100, volume: 50 → 合計 = 750
    expect(result).toBe(750);
  });

  it('大阪・急ぎ配送・2.3kg・2500cm³ → 割増料金が加算される', () => {
    const result = calculateShippingCost({
      weight: 2.3,
      volume: 2500,
      destination: '大阪',
      express: true,
    });
    // base: 700, weight: 300, volume: 150 → 小計 = 1150, 割増 1.2倍 = 1380
    expect(result).toBe(1380);
  });

  it('北海道・重い荷物・急ぎ便 → 高額送料', () => {
    const result = calculateShippingCost({
      weight: 5,
      volume: 5000,
      destination: '北海道',
      express: true,
    });
    // base: 1000, weight: 500, volume: 250 → 小計=1750, express=2100
    expect(result).toBe(2100);
  });

  it('不明な地域 → "その他" 扱いになる', () => {
    const result = calculateShippingCost({
      weight: 1,
      volume: 1000,
      destination: '鹿児島',
      express: false,
    });
    // その他: 800, +100 +50 = 950
    expect(result).toBe(950);
  });

  it('小数点付き重量・ボリューム → 切り上げされる', () => {
    const result = calculateShippingCost({
      weight: 1.2,          // → 切り上げで2kg分
      volume: 1501,         // → 切り上げで2×50円
      destination: '東京',
      express: false,
    });
    // base: 600, weight: 200, volume: 100 → 900
    expect(result).toBe(900);
  });

  it('急ぎ便フラグが false の場合 → 割増なし', () => {
    const result = calculateShippingCost({
      weight: 1,
      volume: 1000,
      destination: '東京',
      express: false,
    });
    expect(result).toBe(750); // 割増されていないことを確認
  });
});