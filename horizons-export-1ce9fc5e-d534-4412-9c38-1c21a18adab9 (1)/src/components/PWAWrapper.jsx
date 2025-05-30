import React, { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';

const PWAWrapper = ({ children }) => {
  const { isPWA } = usePWA();

  useEffect(() => {
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

      // Force toutes les routes à rester dans le contexte PWA
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = function(...args) {
        const result = originalPushState.apply(this, args);
        // Empêcher la navigation externe
        return result;
      };

      history.replaceState = function(...args) {
        const result = originalReplaceState.apply(this, args);
        // Empêcher la navigation externe
        return result;
      };

      // Empêcher la navigation externe et les nouvelles fenêtres
      const handleClick = (e) => {
        const link = e.target.closest('a');
        if (link && link.href) {
          const url = new URL(link.href);
          if (url.origin !== window.location.origin) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
          // S'assurer que les liens internes utilisent React Router
          if (link.href.includes(window.location.origin) && !link.target) {
            e.preventDefault();
            const path = url.pathname + url.search + url.hash;
            window.history.pushState(null, '', path);
            window.dispatchEvent(new PopStateEvent('popstate'));
            return false;
          }
        }
      };

      // Empêcher l'ouverture de nouveaux onglets/fenêtres
      const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 't' || e.key === 'n' || e.key === 'w')) {
          e.preventDefault();
        }
      };

      // Empêcher le menu contextuel sur iOS
      const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
      };

      document.addEventListener('click', handleClick, true);
      document.addEventListener('keydown', handleKeyDown, true);
      document.addEventListener('contextmenu', handleContextMenu, false);

      return () => {
        document.removeEventListener('click', handleClick, true);
        document.removeEventListener('keydown', handleKeyDown, true);
        document.removeEventListener('contextmenu', handleContextMenu, false);
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
        
        // Nettoyer les styles si le composant est démonté
        document.body.style.height = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.overscrollBehavior = '';
        document.body.style.touchAction = '';
      };
    }
  }, [isPWA]);

  return (
    <div className={`pwa-wrapper ${isPWA ? 'pwa-mode' : ''}`}>
      {children}
      {isPWA && (
        <style jsx global>{`
          .pwa-mode {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            height: 100vh !important;
            height: -webkit-fill-available !important;
            overflow: hidden !important;
            z-index: 0 !important;
          }
          
          .pwa-mode * {
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
          }
          
          .pwa-mode input,
          .pwa-mode textarea,
          .pwa-mode [contenteditable] {
            -webkit-user-select: auto !important;
            -moz-user-select: auto !important;
            -ms-user-select: auto !important;
            user-select: auto !important;
          }

          /* Empêcher le défilement élastique sur iOS */
          .pwa-mode body {
            position: fixed !important;
            height: 100vh !important;
            height: -webkit-fill-available !important;
            width: 100% !important;
            overflow: hidden !important;
            overscroll-behavior: none !important;
            -webkit-overflow-scrolling: touch !important;
          }
        `}</style>
      )}
    </div>
  );
};

export default PWAWrapper;
