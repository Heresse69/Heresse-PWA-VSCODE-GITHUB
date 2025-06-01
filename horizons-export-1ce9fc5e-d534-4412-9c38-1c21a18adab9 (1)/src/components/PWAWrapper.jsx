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
      
      // Styles pour le body - PERMETTRE LE SCROLL
      body.style.height = '100vh';
      body.style.height = '-webkit-fill-available';
      // IMPORTANT: Ne pas mettre overflow: hidden pour le scroll
      body.style.position = 'relative'; // Pas fixed pour permettre le scroll
      body.style.width = '100%';
      body.style.overscrollBehavior = 'none';
      body.style.touchAction = 'pan-y'; // Permettre le scroll vertical
      body.style.webkitOverflowScrolling = 'touch';
      
      // Styles pour le html - PERMETTRE LE SCROLL
      html.style.height = '100%';
      // IMPORTANT: Ne pas mettre overflow: hidden
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
      
      // Empêcher seulement le zoom pinch, permettre TOUT le scroll
      document.addEventListener('touchstart', (e) => {
        // Seulement empêcher les gestes multi-touch (zoom)
        if (e.touches && e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });
      
      // Empêcher seulement le pull-to-refresh au niveau global
      document.addEventListener('touchmove', (e) => {
        // Ne pas empêcher le scroll dans les containers scrollables
        const scrollableElement = e.target.closest('.matches-container, .chat-messages, [data-scrollable="true"], .overflow-y-auto');
        if (scrollableElement) {
          return; // Laisser le scroll se faire naturellement
        }
        
        // Empêcher seulement le pull-to-refresh si on est en haut de page et qu'on tire vers le bas
        if (window.scrollY === 0 && e.touches[0] && e.touches[0].clientY > e.touches[0].startY) {
          e.preventDefault();
        }
      }, { passive: false });
      
      console.log('[PWA] Mode standalone détecté et configuré');
    }

    return () => {
      // Nettoyer les styles si le composant est démonté
      if (isPWA) {
        const body = document.body;
        const html = document.documentElement;
        
        body.style.height = '';
        // body.style.overflow = ''; // Pas défini
        body.style.position = '';
        body.style.width = '';
        // body.style.top = ''; // Pas défini
        // body.style.left = ''; // Pas défini
        body.style.overscrollBehavior = '';
        body.style.touchAction = '';
        body.style.webkitOverflowScrolling = '';
        
        // html.style.height = ''; // Pas défini
        // html.style.overflow = ''; // Pas défini
        html.style.overscrollBehavior = '';
        
        console.log('[PWA] Configuration nettoyée');
      }
    };
  }, []);

  return children;
};

export default PWAWrapper;
