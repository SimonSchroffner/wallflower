/**
 * QR code display component (bottom-right corner)
 */

import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

export function QRCodeDisplay() {
  const [mobileUrl, setMobileUrl] = useState('');

  useEffect(() => {
    const url = import.meta.env.VITE_MOBILE_URL || 'http://localhost:5174';
    setMobileUrl(url);
  }, []);

  if (!mobileUrl) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 30,
        right: 30,
        background: 'white',
        padding: 20,
        borderRadius: 16,
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        zIndex: 1000,
        animation: 'qrPulse 3s ease-in-out infinite',
      }}
    >
      <QRCodeSVG
        value={mobileUrl}
        size={180}
        level="M"
        includeMargin={false}
      />
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#333',
          textAlign: 'center',
        }}
      >
        Scan to plant<br />your flower
      </div>
      <style>{`
        @keyframes qrPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}
