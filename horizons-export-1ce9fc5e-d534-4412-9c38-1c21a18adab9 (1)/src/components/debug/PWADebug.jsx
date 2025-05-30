import React, { useState } from 'react';
import { usePWA } from '@/hooks/usePWA';

const PWADebug = () => {
  const { isPWA } = usePWA();
  const [forceTestPWA, setForceTestPWA] = useState(false);
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  // Simuler le mode PWA pour le test
  React.useEffect(() => {
    if (forceTestPWA) {
      // Ajouter temporairement une classe CSS au body pour simuler PWA
      document.body.classList.add('force-pwa-test');
    } else {
      document.body.classList.remove('force-pwa-test');
    }
  }, [forceTestPWA]);
  
  return (
    <div className="fixed top-2 right-2 z-50 bg-black/80 text-white p-2 rounded text-xs">
      PWA: {isPWA || forceTestPWA ? '✅ OUI' : '❌ NON'}
      <br />
      Standalone: {window.navigator.standalone ? '✅' : '❌'}
      <br />
      Display Mode: {window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'}
      <br />
      <button 
        onClick={() => setForceTestPWA(!forceTestPWA)}
        className="mt-1 px-2 py-1 bg-blue-600 text-white rounded text-xs"
      >
        {forceTestPWA ? 'Désactiver Test PWA' : 'Tester Mode PWA'}
      </button>
    </div>
  );
};

export default PWADebug;
