// frontend/pages/JanScannerPage.tsx
import React, { useState } from 'react';
import BarcodeScanner from '../components/BarcodeScanner';

export default function JanScannerPage() {
  const [product, setProduct] = useState<any>(null);

  const handleDetected = async (code: string) => {
    const res = await fetch(`/api/janSearch?jan=${code}`);
    const data = await res.json();
    setProduct(data);
  };

  return (
    <div>
      <h1>JANコードスキャン</h1>
      <BarcodeScanner onDetected={handleDetected} />
      {product && (
        <div>
          <h2>{product.name}</h2>
          <p>{product.maker}</p>
        </div>
      )}
    </div>
  );
}