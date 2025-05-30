import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [isPWA, setIsPWA] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

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
        
        // Prevent external navigation in PWA mode
        const preventExternalNavigation = (e) => {
          const target = e.target.closest('a');
          if (target && target.href && target.href.startsWith('http') && !target.href.includes(window.location.origin)) {
            e.preventDefault();
            // Keep navigation within PWA context
            return false;
          }
        };
        
        document.addEventListener('touchmove', preventBehaviors, { passive: false });
        document.addEventListener('touchstart', preventBehaviors, { passive: false });
        document.addEventListener('click', preventExternalNavigation, true);
        
        return () => {
          document.removeEventListener('touchmove', preventBehaviors);
          document.removeEventListener('touchstart', preventBehaviors);
          document.removeEventListener('click', preventExternalNavigation, true);
        };
      }
    };
    
    checkPWAMode();
    
    // Listen for PWA install events
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsPWA(true);
    };
    
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkPWAMode);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      mediaQuery.removeEventListener('change', checkPWAMode);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
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
  }, [isPWA]);

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

  const installApp = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }

    return outcome === 'accepted';
  };

  return {
    isPWA,
    isInstallable,
    installApp,
    getPWAStyles,
    getPWAClasses
  };
};
