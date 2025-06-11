/**
 * PWA Scroll Fix - Applique directement les styles nécessaires pour le scroll en mode PWA
 * Cette approche bypasse les problèmes de compilation CSS et garantit que les styles sont appliqués
 */

export const applyPWAScrollFix = () => {
  // Vérifier si on est en mode PWA (standalone)
  const isPWA = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  
  if (!isPWA) {
    console.log('🔄 Mode normal (Safari) - Aucun fix PWA nécessaire');
    return;
  }

  console.log('🎯 Mode PWA détecté - Application des fixes de scroll');

  // Créer les styles PWA dynamiquement
  const style = document.createElement('style');
  style.id = 'pwa-scroll-fix';
  style.textContent = `
    /* === PWA SCROLL FIX - Appliqué dynamiquement === */
    @media (display-mode: standalone) {
      
      /* Base PWA */
      html, body {
        height: 100% !important;
        height: -webkit-fill-available !important;
        overflow: hidden !important;
        overscroll-behavior: none !important;
        -webkit-overflow-scrolling: touch !important;
      }
      
      body {
        position: fixed !important;
        width: 100% !important;
        top: 0 !important;
        left: 0 !important;
        touch-action: manipulation !important;
      }
      
      /* 🎯 MATCHES PAGE - Container de la liste des matchs */
      .matches-container {
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior: contain !important;
        touch-action: pan-y !important;
      }
      
      /* 🎯 CHAT MESSAGES - Container des messages de conversation */
      .chat-messages.flex-1.p-4.space-y-4.overflow-y-auto {
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior: contain !important;
        touch-action: pan-y !important;
      }
      
      /* 🎯 CHAT LIST - Liste des conversations */
      .flex-1.px-3.pb-20.overflow-y-auto.overflow-x-hidden.mobile-scroll.prevent-bounce {
        overflow-y: auto !important;
        overflow-x: hidden !important;
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior: contain !important;
        touch-action: pan-y !important;
      }
      
      /* 🎯 STORIES - Préserver le scroll horizontal */
      .flex.space-x-2.overflow-x-auto,
      .flex.space-x-3.overflow-x-auto {
        overflow-x: auto !important;
        overflow-y: hidden !important;
        -webkit-overflow-scrolling: touch !important;
        touch-action: pan-x !important;
      }
      
      /* 🎯 SCROLLABLE GÉNÉRIQUE - Pour tous les éléments avec cette classe */
      .scrollable, [data-scrollable="true"] {
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior: contain !important;
        touch-action: pan-y !important;
      }
    }
  `;

  // Supprimer l'ancien style s'il existe
  const existingStyle = document.getElementById('pwa-scroll-fix');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Ajouter le nouveau style
  document.head.appendChild(style);

  // Forcer l'application des styles sur les éléments existants
  setTimeout(() => {
    const scrollableSelectors = [
      '.matches-container',
      '.chat-messages.flex-1.p-4.space-y-4.overflow-y-auto',
      '.flex-1.px-3.pb-20.overflow-y-auto.overflow-x-hidden.mobile-scroll.prevent-bounce',
      '.scrollable',
      '[data-scrollable="true"]'
    ];

    scrollableSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.overflowY = 'auto';
        el.style.webkitOverflowScrolling = 'touch';
        el.style.overscrollBehavior = 'contain';
        el.style.touchAction = 'pan-y';
        console.log(`✅ Scroll appliqué sur: ${selector}`);
      });
    });

    // Spécial pour les stories
    const storiesSelectors = [
      '.flex.space-x-2.overflow-x-auto',
      '.flex.space-x-3.overflow-x-auto'
    ];

    storiesSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.overflowX = 'auto';
        el.style.overflowY = 'hidden';
        el.style.webkitOverflowScrolling = 'touch';
        el.style.touchAction = 'pan-x';
        console.log(`✅ Scroll horizontal appliqué sur: ${selector}`);
      });
    });

    console.log('🎉 PWA Scroll Fix appliqué avec succès !');
  }, 100);
};

// Auto-application au chargement
export const initPWAScrollFix = () => {
  // Appliquer immédiatement
  applyPWAScrollFix();
  
  // Réappliquer quand les matchMedia changent
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addListener(applyPWAScrollFix);
  }
  
  // Réappliquer après navigation (au cas où de nouveaux éléments sont créés)
  window.addEventListener('popstate', () => {
    setTimeout(applyPWAScrollFix, 100);
  });
};
