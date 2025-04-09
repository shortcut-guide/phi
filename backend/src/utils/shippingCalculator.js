import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
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
const calculateVolumeWeight = (length, width, height, divisor = 5000) => {
  return (length * width * height) / divisor;
};

/**
 * ヤマト運輸の送料計算
 * 
 * @param {number} weight - 実重量（kg）
 * @param {number} length - 荷物の長さ（cm）
 * @param {number} width - 荷物の幅（cm）
 * @param {number} height - 荷物の高さ（cm）
 * @returns {number} - 算出された送料（元）
 */
const calculateYamatoShippingCost = async (weight, length, width, height) => {
  const rates = shippingRates.yamato;
  console.log('Yamato Rates:', rates);

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
 * 佐川急便の送料計算
 * 
 * @param {number} weight - 実重量（kg）
 * @param {number} length - 荷物の長さ（cm）
 * @param {number} width - 荷物の幅（cm）
 * @param {number} height - 荷物の高さ（cm）
 * @returns {number} - 算出された送料（元）
 */
const calculateSagawaShippingCost = async (weight, length, width, height) => {
  const rates = shippingRates.sagawa;
  const volumeWeight = calculateVolumeWeight(length, width, height, 5000);
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
  const rates = shippingRates.ems;
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
  const rates = shippingRates.ocs;
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