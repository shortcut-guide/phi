import { BrowserMultiFormatReader } from '@zxing/browser';
import React, { useRef, useEffect, useState } from 'react';

export default function BarcodeScanner({ onDetected }: { onDetected: (code: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const codeReader = new BrowserMultiFormatReader();
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        codeReader.decodeFromVideoDevice(undefined, videoRef.current!, (result, err) => {
          if (result) {
            onDetected(result.getText());
          }
          if (err) {
            console.error(err);
          }
        });
      } catch (err) {
        console.error('初期化エラー', err);
        setError('カメラの初期化に失敗しました');
      }
    };

    init();
  }, [onDetected]);

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%' }}>
        <track kind="captions" src="" srcLang="en" label="English captions" />
      </video>
      {error && <p>{error}</p>}
    </div>
  );
}

// Removed the conflicting local useRef function
