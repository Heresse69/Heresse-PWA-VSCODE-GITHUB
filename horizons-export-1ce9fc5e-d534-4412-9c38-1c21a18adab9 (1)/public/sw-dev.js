/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */

// Service Worker de développement - CACHE DÉSACTIVÉ
// Pour permettre les hot reloads et éviter l'écran blanc en développement

console.log('[Dev Service Worker] Mode développement - Cache désactivé');

// Ne pas installer de cache en mode développement
self.addEventListener('install', (event) => {
  console.log('[Dev Service Worker] Installation - Skip waiting');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Supprimer tous les anciens caches
    caches.keys().then((cacheNames) => {
      console.log('[Dev Service Worker] Suppression de tous les caches pour développement');
      return Promise.all(
        cacheNames.map((name) => {
          console.log('[Dev Service Worker] Suppression du cache:', name);
          return caches.delete(name);
        })
      );
    }).then(() => {
      console.log('[Dev Service Worker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// En mode développement : TOUJOURS utiliser le réseau, JAMAIS le cache
self.addEventListener('fetch', (event) => {
  // Pour les requêtes de navigation
  if (event.request.mode === 'navigate') {
    console.log('[Dev Service Worker] Navigation - Bypassing cache:', event.request.url);
    event.respondWith(
      fetch(event.request).catch(() => {
        // En cas d'erreur réseau, essayer de servir index.html
        return fetch('/index.html');
      })
    );
    return;
  }

  // Pour toutes les autres requêtes : toujours utiliser le réseau
  console.log('[Dev Service Worker] Bypassing cache for:', event.request.url);
  event.respondWith(
    fetch(event.request).catch(error => {
      console.error('[Dev Service Worker] Fetch failed:', error);
      throw error;
    })
  );
});

// Message pour confirmer que le SW dev est actif
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PING') {
    event.ports[0].postMessage({
      type: 'PONG',
      message: 'Dev Service Worker actif - Cache désactivé'
    });
  }
});
