/**
 * 配送料金を計算するユーティリティ
 *
 * @param {Object} options
 * @param {number} options.weight - 重量（kg単位）
 * @param {number} options.volume - 容積（縦cm × 横cm × 高さcm）
 * @param {string} options.destination - 配送先（都道府県名など）
 * @param {boolean} options.express - 急ぎ便かどうか（trueなら割増）
 * @returns {number} - 計算された送料（円）
 */
const calculateShippingCost = ({ weight, volume, destination, express = false }) => {
  // 地域による基本料金（例：北海道や沖縄は高め）
  const regionBaseRate = {
    東京: 600,
    大阪: 700,
    北海道: 1000,
    沖縄: 1200,
    その他: 800,
  };

  const baseRate = regionBaseRate[destination] || regionBaseRate['その他'];

  // 重量加算（1kgごとに+100円）
  const weightFee = Math.ceil(weight) * 100;

  // 容積加算（1000cm³ごとに+50円）
  const volumeFee = Math.ceil(volume / 1000) * 50;

  // 急ぎ便割増（20%増し）
  const expressFeeRate = express ? 1.2 : 1.0;

  // 総合計
  const total = Math.ceil((baseRate + weightFee + volumeFee) * expressFeeRate);

  return total;
};

export default calculateShippingCost;