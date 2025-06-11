import React from 'react';
import ReactDOM from 'react-dom/client';
import MobileTestApp from '@/App-mobile-test';
import PWAWrapper from '@/components/PWAWrapper';

// Version mobile de test
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PWAWrapper>
      <MobileTestApp />
    </PWAWrapper>
  </React.StrictMode>
);

console.log('🔧 [Mobile Test] Application démarrée');

// Service Worker pour test mobile
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ [Mobile Test] Service Worker registered:', registration);
      })
      .catch(registrationError => {
        console.log('❌ [Mobile Test] Service Worker failed:', registrationError);
      });
  });
}

// Diagnostic des erreurs mobiles
window.addEventListener('error', (event) => {
  console.error('❌ [Mobile Test] Error:', event.error);
  document.body.innerHTML += `
    <div style="position: fixed; top: 0; left: 0; right: 0; background: #ef4444; color: white; padding: 10px; z-index: 9999;">
      ❌ Erreur: ${event.error?.message || 'Erreur inconnue'}
    </div>
  `;
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ [Mobile Test] Unhandled Promise:', event.reason);
});
