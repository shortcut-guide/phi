// 商品IDと目的地を入力して送料を計算するコンポーネント
import React, { useState } from 'react';
import axios from 'axios';

const ShippingCalculator = () => {
    const [productId, setProductId] = useState('');
    const [destination, setDestination] = useState('');
    const [shippingCost, setShippingCost] = useState(null);

    const handleCalculate = async () => {
        const response = await axios.post('/api/calculate-shipping', { productId, destination });
        setShippingCost(response.data.cost);
    };

    return (
        <div>
            <input type="text" value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="商品ID" />
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="目的地" />
            <button onClick={handleCalculate}>計算</button>
            {shippingCost !== null && <p>送料: {shippingCost}円</p>}
        </div>
    );
};

export default ShippingCalculator;