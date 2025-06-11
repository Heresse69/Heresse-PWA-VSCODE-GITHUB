import React from 'react';
import ReactDOM from 'react-dom/client';
import AppMobileDiagnostic from './App-mobile-diagnostic.jsx';

console.log('🚀 [Mobile Diagnostic] Starting mobile diagnostic app...');

// Logs détaillés pour mobile
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.log = (...args) => {
  originalConsoleLog('[MOBILE LOG]', ...args);
};

console.error = (...args) => {
  originalConsoleError('[MOBILE ERROR]', ...args);
};

console.warn = (...args) => {
  originalConsoleWarn('[MOBILE WARN]', ...args);
};

// Capture d'erreurs globales
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error?.message || event.message);
  console.error('Stack:', event.error?.stack);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Informations de démarrage
console.log('Environment:', {
  userAgent: navigator.userAgent,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
  screen: `${screen.width}x${screen.height}`,
  pixelRatio: window.devicePixelRatio,
  touch: 'ontouchstart' in window,
  standalone: window.matchMedia('(display-mode: standalone)').matches
});

// Test de montage React
try {
  console.log('🔧 Creating React root...');
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  console.log('🎯 Rendering diagnostic app...');
  root.render(
    <React.StrictMode>
      <AppMobileDiagnostic />
    </React.StrictMode>
  );
  
  console.log('✅ React app rendered successfully');
  
} catch (error) {
  console.error('❌ Failed to render React app:', error);
  
  // Fallback en cas d'erreur
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; font-family: monospace; background: #1a1a1a; color: white; min-height: 100vh;">
      <h1 style="color: #ef4444;">❌ React Render Failed</h1>
      <div style="background: #333; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <strong>Error:</strong> ${error.message}<br>
        <strong>Stack:</strong> <pre style="margin-top: 10px; font-size: 12px;">${error.stack}</pre>
      </div>
      <button onclick="window.location.reload()" style="background: #10b981; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer;">
        🔄 Reload Page
      </button>
      <button onclick="window.location.href='/'" style="background: #3b82f6; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; margin-left: 10px;">
        🏠 Main App
      </button>
    </div>
  `;
}
