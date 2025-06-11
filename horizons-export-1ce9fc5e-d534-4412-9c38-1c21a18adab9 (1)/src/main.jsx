import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import PWAWrapper from '@/components/PWAWrapper';
import { killIOSSafeArea } from './ios-hack';
import { applyPWAScrollFix } from '@/utils/pwaScrollFix';
import '@/index.css';

// HACK BRUTAL POUR iOS
killIOSSafeArea();

// NOUVEAU : Fix PWA pour le scroll
applyPWAScrollFix();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PWAWrapper>
      <App />
    </PWAWrapper>
  </React.StrictMode>
);

// Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered: ', registration);
      })
      .catch(registrationError => {
        console.log('Service Worker registration failed: ', registrationError);
      });
  });
}