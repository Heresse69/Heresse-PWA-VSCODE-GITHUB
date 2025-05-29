import React, { useEffect } from 'react';

const PWAWrapper = ({ children }) => {
  useEffect(() => {
    // Détecter le mode PWA et appliquer les styles nécessaires
    const isPWA = window.navigator.standalone === true || 
                  window.matchMedia('(display-mode: standalone)').matches ||
                  window.matchMedia('(display-mode: fullscreen)').matches;
    
    if (isPWA) {
      // Configuration PWA globale pour éviter les barres Safari
      document.body.style.height = '100vh';
      document.body.style.height = '-webkit-fill-available';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
      document.body.style.left = '0';
      document.body.style.overscrollBehavior = 'none';
      document.body.style.touchAction = 'manipulation';
      
      // Forcer le viewport
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
    }

    return () => {
      // Nettoyer les styles si le composant est démonté
      if (isPWA) {
        document.body.style.height = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.overscrollBehavior = '';
        document.body.style.touchAction = '';
      }
    };
  }, []);

  return children;
};

export default PWAWrapper;
