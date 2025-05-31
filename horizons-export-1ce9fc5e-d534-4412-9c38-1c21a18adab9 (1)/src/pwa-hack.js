export const initPWAHack = () => {
  const isPWA = window.navigator.standalone || 
                window.matchMedia('(display-mode: standalone)').matches;
  
  if (isPWA) {
    console.log('🔥 PWA détectée - Application du hack brutal');
    
    const executeHack = () => {
      // Force la hauteur sans safe area
      document.body.style.height = '100vh';
      document.body.style.maxHeight = '100vh';
      document.body.style.overflow = 'hidden';
      document.body.style.paddingBottom = '0';
      
      // Force le root
      const root = document.getElementById('root');
      if (root) {
        root.style.height = '100vh';
        root.style.maxHeight = '100vh';
        root.style.overflow = 'hidden';
      }
      
      // Force la TabBar en bas
      setTimeout(() => {
        const nav = document.querySelector('nav');
        if (nav) {
          nav.style.position = 'fixed';
          nav.style.bottom = '0px';
          nav.style.zIndex = '9999';
          nav.style.width = '100vw';
          console.log('✅ TabBar forcée en position');
        }
      }, 100);
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', executeHack);
    } else {
      executeHack();
    }
    
    window.addEventListener('orientationchange', () => setTimeout(executeHack, 300));
  }
};