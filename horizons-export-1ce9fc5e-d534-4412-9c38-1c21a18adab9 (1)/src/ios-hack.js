// REMPLACEZ TOUT VOTRE src/ios-hack.js PAR ÇA :

export const killIOSSafeArea = () => {
  if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
    console.log('🔥 MODE PWA - FIX Safe Area + PRÉSERVE le scroll');
    
    const realHeight = window.screen.height;
    const realWidth = window.screen.width;
    
    console.log('Écran réel:', realWidth, 'x', realHeight);
    
    const style = document.createElement('style');
    style.textContent = `
      /* FORCE SEULEMENT html/body pour tuer la safe area */
      html {
        height: ${realHeight}px !important;
        max-height: ${realHeight}px !important;
        width: ${realWidth}px !important;
        max-width: ${realWidth}px !important;
        padding: 0 !important;
        margin: 0 !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        overflow: hidden !important;
      }
      
      body {
        height: ${realHeight}px !important;
        max-height: ${realHeight}px !important;
        width: ${realWidth}px !important;
        max-width: ${realWidth}px !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: hidden !important;
      }
      
      /* #root sans scroll pour page home */
      #root {
        height: ${realHeight}px !important;
        max-height: ${realHeight}px !important;
        width: ${realWidth}px !important;
        max-width: ${realWidth}px !important;
        overflow: hidden !important;
        position: relative !important;
      }
      
      /* FORCE la TabBar à la position PARFAITE - SANS SAFE AREA */
      nav[class*="fixed"] {
        position: fixed !important;
        bottom: 0px !important;
        left: 0px !important;
        right: 0px !important;
        z-index: 999999999 !important;
        transform: none !important;
        width: 100vw !important;
        max-width: 100vw !important;
        padding-bottom: 0 !important;
      }
      
      /* SUPPRIME TOUS les pseudo-éléments problématiques */
      body::after, body::before,
      html::after, html::before,
      .max-w-md::after, .max-w-md::before,
      .mx-auto::after, .mx-auto::before,
      .flex::after, .flex::before,
      .flex-col::after, .flex-col::before,
      *::after, *::before {
        display: none !important;
        content: none !important;
        height: 0 !important;
        width: 0 !important;
        opacity: 0 !important;
        visibility: hidden !important;
        position: absolute !important;
        z-index: -9999 !important;
      }
      
      /* PRÉSERVE LE SCROLL des containers internes - CRUCIAL ! */
      .overflow-y-auto {
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
      }
      
      /* SPÉCIFIQUE aux pages Matches/Chat */
      .flex-1.overflow-y-auto {
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        height: auto !important;
        max-height: none !important;
      }
      
      /* Force les headers à rester visibles */
      header {
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: fixed !important;
        z-index: 50 !important;
      }
    `;
    document.head.appendChild(style);
    
    const forcePosition = () => {
      // Force seulement les éléments racines
      document.body.style.height = realHeight + 'px';
      document.body.style.maxHeight = realHeight + 'px';
      document.body.style.overflow = 'hidden';
      document.body.style.padding = '0';
      document.body.style.margin = '0';
      
      const root = document.getElementById('root');
      if (root) {
        root.style.height = realHeight + 'px';
        root.style.maxHeight = realHeight + 'px';
        root.style.overflow = 'hidden';
        root.style.position = 'relative';
      }
      
      // Force la TabBar à la position PARFAITE - SANS SAFE AREA
      const nav = document.querySelector('nav');
      if (nav) {
        nav.style.position = 'fixed';
        nav.style.bottom = '0px';
        nav.style.zIndex = '999999999';
        nav.style.width = '100vw';
        nav.style.left = '0px';
        nav.style.right = '0px';
        nav.style.transform = 'none';
        nav.style.paddingBottom = '0';
      }
      
      // CRUCIAL : Force le scroll des containers internes
      const scrollContainers = document.querySelectorAll('.flex-1.overflow-y-auto');
      scrollContainers.forEach(container => {
        container.style.overflowY = 'auto';
        container.style.webkitOverflowScrolling = 'touch';
        container.style.height = 'auto';
        container.style.maxHeight = 'none';
      });
      
      // Force tous les éléments avec overflow-y-auto
      const allScrollables = document.querySelectorAll('.overflow-y-auto');
      allScrollables.forEach(el => {
        el.style.overflowY = 'auto';
        el.style.webkitOverflowScrolling = 'touch';
      });
      
      // Force les headers visibles
      const headers = document.querySelectorAll('header');
      headers.forEach(header => {
        header.style.display = 'flex';
        header.style.visibility = 'visible';
        header.style.opacity = '1';
      });
    };
    
    forcePosition();
    // Force toutes les 3 secondes
    setInterval(forcePosition, 3000);
    
    window.addEventListener('resize', forcePosition);
    window.addEventListener('orientationchange', () => setTimeout(forcePosition, 100));
  }
};