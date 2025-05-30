import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import PWAWrapper from '@/components/PWAWrapper';
import '@/index.css';

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