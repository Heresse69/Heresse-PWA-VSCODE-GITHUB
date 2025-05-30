import React, { useEffect } from 'react';

const PWAWrapper = ({ children }) => {
  useEffect(() => {
    // Détecter le mode PWA plus robuste
    const isPWA = window.navigator.standalone === true || 
                  window.matchMedia('(display-mode: standalone)').matches ||
                  window.matchMedia('(display-mode: fullscreen)').matches ||
                  window.matchMedia('(display-mode: minimal-ui)').matches;
    
    if (isPWA) {
      // Configuration PWA globale pour éviter les barres Safari
      const body = document.body;
      const html = document.documentElement;
      
      // Styles pour le body
      body.style.height = '100vh';
      body.style.height = '-webkit-fill-available';
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.width = '100%';
      body.style.top = '0';
      body.style.left = '0';
      body.style.overscrollBehavior = 'none';
      body.style.touchAction = 'manipulation';
      body.style.webkitOverflowScrolling = 'touch';
      
      // Styles pour le html
      html.style.height = '100%';
      html.style.overflow = 'hidden';
      html.style.overscrollBehavior = 'none';
      
      // Forcer le viewport et éviter le zoom
      let viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      } else {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        document.head.appendChild(viewport);
      }
      
      // Empêcher le bounce effect sur iOS
      document.addEventListener('touchmove', (e) => {
        if (e.target.closest('.scrollable')) return; // Permettre le scroll dans les zones autorisées
        e.preventDefault();
      }, { passive: false });
      
      console.log('[PWA] Mode standalone détecté et configuré');
    }

    return () => {
      // Nettoyer les styles si le composant est démonté
      if (isPWA) {
        const body = document.body;
        const html = document.documentElement;
        
        body.style.height = '';
        body.style.overflow = '';
        body.style.position = '';
        body.style.width = '';
        body.style.top = '';
        body.style.left = '';
        body.style.overscrollBehavior = '';
        body.style.touchAction = '';
        body.style.webkitOverflowScrolling = '';
        
        html.style.height = '';
        html.style.overflow = '';
        html.style.overscrollBehavior = '';
        
        console.log('[PWA] Configuration nettoyée');
      }
    };
  }, []);

  return children;
};

export default PWAWrapper;
