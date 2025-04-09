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
 * ヤマト運輸の送料計算
 * 
 * @param {Object} params
 * @param {number} params.length 長さ(cm)
 * @param {number} params.width 幅(cm)
 * @param {number} params.height 高さ(cm)
 * @param {number} params.actualWeight 実重量(kg)
 * @param {string} params.destination 配送先（例: '北海道', '沖縄・離島', '本州'）
 * @returns {number} 合計送料（元）
 * 5000 (5000立方cm)
 */
// タオバオ新幹線のヤマト運輸の送料計算
const calculateYamatoShippingCost = async (length, width, height, actualWeight, destination) => {
  const rates = shippingRates.taobaoshinkansen.yamato;
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
  const rates = shippingRates.taobaoshinkansen.sagawa;
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