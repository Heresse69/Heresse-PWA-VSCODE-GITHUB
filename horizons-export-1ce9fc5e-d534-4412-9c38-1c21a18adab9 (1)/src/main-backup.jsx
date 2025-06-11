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
    // Utiliser le service worker de dev en mode développement
    const isDevelopment = import.meta.env.DEV;
    const swPath = isDevelopment ? '/sw-dev.js' : '/sw.js';
    
    console.log(`[SW] Mode: ${isDevelopment ? 'DÉVELOPPEMENT' : 'PRODUCTION'}, SW: ${swPath}`);
    
    navigator.serviceWorker.register(swPath)
      .then(registration => {
        console.log('Service Worker registered: ', registration);
        
        // En mode dev, forcer l'update du SW
        if (isDevelopment) {
          registration.update();
        }
      })
      .catch(registrationError => {
        console.log('Service Worker registration failed: ', registrationError);
      });
  });
}