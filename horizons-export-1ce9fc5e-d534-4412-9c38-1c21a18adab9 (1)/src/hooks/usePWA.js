import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWAMode = () => {
      const isPWAMode = window.navigator.standalone === true || 
                       window.matchMedia('(display-mode: standalone)').matches ||
                       window.matchMedia('(display-mode: fullscreen)').matches;
      setIsPWA(isPWAMode);
      
      if (isPWAMode) {
        // Appliquer les styles PWA globalement mais permettre le scroll
        document.body.style.overscrollBehavior = 'none';
        document.body.style.touchAction = 'pan-y'; // Permettre le scroll vertical
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.webkitTouchCallout = 'none';
        document.body.style.height = '100vh';
        document.body.style.height = '-webkit-fill-available';
        // IMPORTANT: Ne pas mettre overflow: hidden pour permettre le scroll
        
        // Forcer les corrections PWA après un délai pour s'assurer que les éléments sont montés
        setTimeout(() => {
          // Forcer le scroll sur tous les containers critiques
          const scrollableContainers = [
            '.matches-container',
            '.chat-messages', 
            '.flex-1.overflow-y-auto',
            '[data-scrollable="true"]'
          ];
          
          scrollableContainers.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
              el.style.overflowY = 'auto';
              el.style.webkitOverflowScrolling = 'touch';
              el.style.overscrollBehavior = 'contain';
              el.style.touchAction = 'pan-y';
              el.style.height = 'auto';
              el.style.maxHeight = 'none';
            });
          });
        }, 100);
        
        // Empêcher seulement le zoom pinch, pas le scroll
        const preventPinchZoom = (e) => {
          // Seulement empêcher les gestes multi-touch (zoom)
          if (e.touches && e.touches.length > 1) {
            e.preventDefault();
          }
        };
        
        document.addEventListener('touchstart', preventPinchZoom, { passive: false });
        
        return () => {
          document.removeEventListener('touchstart', preventPinchZoom);
        };
      }
    };
    
    checkPWAMode();
    
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkPWAMode);
    
    return () => {
      mediaQuery.removeEventListener('change', checkPWAMode);
      // Nettoyer les styles PWA
      if (isPWA) {
        document.body.style.overscrollBehavior = '';
        document.body.style.touchAction = '';
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        document.body.style.webkitTouchCallout = '';
        document.body.style.height = '';
        // Pas de nettoyage de overflow car on ne l'a pas mis
      }
    };
  }, []);

  const getPWAStyles = () => {
    return isPWA ? {
      height: '100vh',
      height: '-webkit-fill-available',
      overscrollBehavior: 'none',
      touchAction: 'pan-y', // Permettre le scroll vertical
      position: 'relative'
    } : {};
  };

  const getPWAClasses = () => {
    return isPWA ? 'pwa-page' : '';
  };

  return {
    isPWA,
    getPWAStyles,
    getPWAClasses
  };
};
