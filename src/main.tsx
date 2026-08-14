import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Immediate background asset preloading & GPU decode for zero-lag switching
const CRITICAL_ASSETS = [
  '/splash-bg.png',
  '/window-seat.png',
  '/driver-seat.png',
  '/last-seat.png',
];

if (typeof window !== 'undefined') {
  CRITICAL_ASSETS.forEach(src => {
    const img = new Image();
    img.src = src;
    if ('decode' in img) {
      img.decode().catch(() => {});
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
