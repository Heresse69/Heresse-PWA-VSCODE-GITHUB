import { useEffect } from 'react';

/**
 * Hook pour bloquer/débloquer le scroll du body
 * @param {boolean} isLocked - Si true, le scroll est bloqué
 */
export const useScrollLock = (isLocked = true) => {
  useEffect(() => {
    if (isLocked) {
      // Bloquer le scroll
      document.body.classList.add('no-scroll');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.top = '0';
      document.body.style.left = '0';
      
      // Bloquer également le scroll sur les devices iOS
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('wheel', preventScroll, { passive: false });
    } else {
      // Débloquer le scroll
      document.body.classList.remove('no-scroll');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';
      document.body.style.left = '';
      
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', preventScroll);
    }

    // Cleanup function pour restaurer le scroll quand le composant se démonte
    return () => {
      document.body.classList.remove('no-scroll');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';
      document.body.style.left = '';
      
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', preventScroll);
    };
  }, [isLocked]);
};

// Fonction pour empêcher le scroll
const preventScroll = (e) => {
  // Permettre le scroll uniquement à l'intérieur des éléments avec la classe 'scrollable'
  let target = e.target;
  while (target && target !== document.body) {
    if (target.classList?.contains('scrollable') || target.getAttribute('data-scrollable') === 'true') {
      return; // Permettre le scroll dans cet élément
    }
    target = target.parentElement;
  }
  
  // Bloquer le scroll ailleurs
  e.preventDefault();
  e.stopPropagation();
};

export default useScrollLock;
