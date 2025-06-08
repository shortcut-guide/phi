import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import agents from '../data/agents.json';
import shippingRates from '../data/shippingRates.json';

/**
 * 容積重量を計算する関数
 * 
 * @param {number} length - 荷物の長さ（cm）
 * @param {number} width - 荷物の幅（cm）
 * @param {number} height - 荷物の高さ（cm）
 * @param {number} divisor - 容積重量の除数（5000や6000など）
 * @returns {number} - 容積重量（kg）
 */
const calculateVolumeWeight = (length, width, height, divisor) => {
  return (length * width * height) / divisor;
};

/**
 * 超過サイズチェック
 * @param {number} length - 荷物の長さ（cm）
 * @param {number} width - 荷物の幅（cm）
 * @param {number} height - 荷物の高さ（cm）
 * @param {Object} rates - 送料適用会社の料金情報
 * @param {number} rates.overSizeMin - 超過サイズの最小値(cm)
 * @param {number} rates.overSizeMax - 超過サイズの最大値(cm)
 * @param {number} rates.overSizeCost - 超過料金（元）
 * @returns {number} - 超過料金（元）
**/
const overSize = (items,length,width,height,rates) =>{
  // 合計サイズ（3辺の長さの合計）
  const totalSize = length + width + height;
  
  // サイズが60cm以上140cm未満の場合、超過料金は10元
  if (totalSize >= rates.overSizeMin && totalSize < rates.overSizeMax) return rates.overSizeCost;

  // サイズが140cm以上の場合、超過料金は20元
  if (totalSize >= 140) return 20;

  // サイズが60cm未満の場合、超過料金は0元
  return 0;
};


/**
 * ヤマト運輸の送料計算
 * 
 * @param {Object} params
 * @param {number} params.items 商品数
 * @param {number} params.length 長さ(cm)
 * @param {number} params.width 幅(cm)
 * @param {number} params.height 高さ(cm)
 * @param {number} params.actualWeight 実重量(kg)
 * @param {string} params.destination 配送先（例: '北海道', '沖縄・離島', '本州'）
 * @param {number} params.overSize 超過料金（元）
 * @param {number} params.volumeWeight 容積重量（kg）
 * @param {number} params.applicableWeight 適用重量（kg）
 * @param {number} params.additionalCost 追加料金（元）
 * @param {number} params.additionalWeight 追加重量（kg）
 * @param {number} params.baseWeight 基本重量（kg）
 * @param {number} params.baseCost 基本料金（元）
 * @param {number} params.divisor 容積重量の除数
 * @returns {number} 合計送料（元）
 * 5000 (5000立方cm)
 */
// タオバオ新幹線のヤマト運輸の送料計算
const calculateYamatoShippingCost = async (length, width, height, actualWeight, destination) => {
  const rates = shippingRates.taobaoshinkansen.individualImport.yamato;
  const volumeWeight = calculateVolumeWeight(length, width, height, rates.divisor);
  const applicableWeight = Math.max(actualWeight, volumeWeight);

  if (applicableWeight <= rates.baseWeight) {
    return rates.baseCost;
  } else {
    const additionalCost = Math.ceil((applicableWeight - rates.baseWeight) / rates.additionalWeight) * rates.additionalCost;
    return rates.baseCost + additionalCost;
  }
};

/**
 * 佐川急便の送料計算
 * 
 * @param {number} weight - 実重量（kg）
 * @param {number} length - 荷物の長さ（cm）
 * @param {number} width - 荷物の幅（cm）
 * @param {number} height - 荷物の高さ（cm）
 * @returns {number} - 算出された送料（元）
 */
const calculateSagawaShippingCost = async (weight, length, width, height) => {
  const rates = shippingRates.taobaoshinkansen.individualImport.sagawa;
  const volumeWeight = calculateVolumeWeight(length, width, height, rates.divisor);
  const applicableWeight = Math.max(weight, volumeWeight);

  if (applicableWeight <= rates.baseWeight) {
    return rates.baseCost;
  } else {
    return rates.baseCost + Math.ceil((applicableWeight - rates.baseWeight) / rates.additionalWeight) * rates.additionalCost;
  }
};

/**
 * EMSの送料計算
 * 
 * @param {number} weight - 実重量（kg）
 * @param {number} length - 荷物の長さ（cm）
 * @param {number} width - 荷物の幅（cm）
 * @param {number} height - 荷物の高さ（cm）
 * @returns {number} - 算出された送料（元）
 */
const calculateEMSShippingCost = async (weight, length, width, height) => {
  const rates = shippingRates.taobaoshinkansen.ems;
  console.log('EMS Rates:', rates);

  const volumeWeight = calculateVolumeWeight(length, width, height, 5000);
  console.log('Volume Weight:', volumeWeight);

  const applicableWeight = Math.max(weight, volumeWeight);
  console.log('Applicable Weight:', applicableWeight);

  if (applicableWeight <= rates.baseWeight) {
    console.log('Base Cost:', rates.baseCost);
    return rates.baseCost;
  } else {
    const additionalCost = Math.ceil((applicableWeight - rates.baseWeight) / rates.additionalWeight) * rates.additionalCost;
    console.log('Additional Cost:', additionalCost);
    return rates.baseCost + additionalCost;
  }
};

/**
 * OCSの送料計算
 * 
 * @param {number} weight - 実重量（kg）
 * @param {number} length - 荷物の長さ（cm）
 * @param {number} width - 荷物の幅（cm）
 * @param {number} height - 荷物の高さ（cm）
 * @returns {number} - 算出された送料（元）
 */
const calculateOCSShippingCost = async (weight, length, width, height) => {
  const rates = shippingRates.taobaoshinkansen.ocs;
  console.log('OCS Rates:', rates);

  const volumeWeight = calculateVolumeWeight(length, width, height, 5000);
  console.log('Volume Weight:', volumeWeight);

  const applicableWeight = Math.max(weight, volumeWeight);
  console.log('Applicable Weight:', applicableWeight);

  if (applicableWeight <= rates.baseWeight) {
    console.log('Base Cost:', rates.baseCost);
    return rates.baseCost;
  } else {
    const additionalCost = Math.ceil((applicableWeight - rates.baseWeight) / rates.additionalWeight) * rates.additionalCost;
    console.log('Additional Cost:', additionalCost);
    return rates.baseCost + additionalCost;
  }
};

export {
  calculateYamatoShippingCost,
  calculateSagawaShippingCost,
  calculateEMSShippingCost,
  calculateOCSShippingCost
};