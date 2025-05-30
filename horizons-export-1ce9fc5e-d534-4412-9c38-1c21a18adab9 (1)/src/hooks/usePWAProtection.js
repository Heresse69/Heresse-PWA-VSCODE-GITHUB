import { useEffect, useState } from 'react';

/**
 * Hook pour détecter et maintenir le mode PWA
 * Utilisé comme protection supplémentaire contre la sortie du mode standalone
 */
export const usePWAProtection = () => {
  const [isPWA, setIsPWA] = useState(false);
  const [hasLostPWA, setHasLostPWA] = useState(false);

  useEffect(() => {
    // Détecter le mode PWA initial
    const checkPWAMode = () => {
      const isPWAMode = window.navigator.standalone === true || 
                       window.matchMedia('(display-mode: standalone)').matches ||
                       window.matchMedia('(display-mode: fullscreen)').matches ||
                       window.matchMedia('(display-mode: minimal-ui)').matches;
      
      setIsPWA(isPWAMode);
      return isPWAMode;
    };

    // Vérification initiale
    const initialPWAState = checkPWAMode();

    // Surveiller les changements de mode d'affichage
    const mediaQueryList = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e) => {
      const currentPWAState = checkPWAMode();
      
      // Si on était en PWA et qu'on ne l'est plus, marquer comme perdu
      if (initialPWAState && !currentPWAState) {
        setHasLostPWA(true);
        console.warn('[PWA Protection] Mode PWA perdu détecté');
      }
    };

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleDisplayModeChange);
    } else {
      // Fallback pour les anciens navigateurs
      mediaQueryList.addListener(handleDisplayModeChange);
    }

    // Surveillance de la visibilité pour détecter les changements
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkPWAMode();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleDisplayModeChange);
      } else {
        mediaQueryList.removeListener(handleDisplayModeChange);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Fonction pour forcer le retour en mode PWA
  const redirectToPWA = () => {
    if (!isPWA && window.location.pathname !== '/') {
      // Rediriger vers la racine qui devrait ouvrir l'app PWA
      window.location.href = '/';
    }
  };

  return {
    isPWA,
    hasLostPWA,
    redirectToPWA
  };
};

export default usePWAProtection;
