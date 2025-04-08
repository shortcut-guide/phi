// タオバオの商品情報を取得し、国際送料を計算するエンドポイントを提供
const express = require('express');
const { getProductDetails } = require('../services/taobaoApiService');
const { calculateShippingCost } = require('../utils/shippingCalculator');

const router = express.Router();

// 商品IDと目的地を受け取り、送料を計算するエンドポイント
router.post('/calculate-shipping', async (req, res) => {
    const { productId, destination } = req.body;

    if (!productId || !destination) {
        return res.status(400).json({ error: '商品IDと目的地は必須です。' });
    }

    try {
        // タオバオAPIから商品情報を取得
        const productDetails = await getProductDetails(productId);

        if (!productDetails) {
            return res.status(404).json({ error: '商品情報が見つかりません。' });
        }

        // 送料を計算
        const shippingCost = calculateShippingCost(productDetails, destination);

        res.json({ cost: shippingCost });
    } catch (error) {
        console.error('送料計算中にエラーが発生しました:', error);
        res.status(500).json({ error: '内部サーバーエラーが発生しました。' });
    }
});

module.exports = router;