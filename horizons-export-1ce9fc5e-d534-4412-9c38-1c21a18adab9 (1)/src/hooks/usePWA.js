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
        // Appliquer les styles PWA globalement
        document.body.style.overscrollBehavior = 'none';
        document.body.style.touchAction = 'manipulation';
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.webkitTouchCallout = 'none';
        document.body.style.height = '100vh';
        document.body.style.height = '-webkit-fill-available';
        document.body.style.overflow = 'hidden';
        
        // Empêcher le pull-to-refresh et le zoom
        const preventBehaviors = (e) => {
          if (e.touches.length > 1) {
            e.preventDefault();
          }
        };
        
        document.addEventListener('touchmove', preventBehaviors, { passive: false });
        document.addEventListener('touchstart', preventBehaviors, { passive: false });
        
        return () => {
          document.removeEventListener('touchmove', preventBehaviors);
          document.removeEventListener('touchstart', preventBehaviors);
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
        document.body.style.overflow = '';
      }
    };
  }, []);

  const getPWAStyles = () => {
    return isPWA ? {
      height: '100vh',
      height: '-webkit-fill-available',
      overscrollBehavior: 'none',
      touchAction: 'manipulation',
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
