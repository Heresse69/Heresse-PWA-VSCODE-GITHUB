/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'heresse-cache-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/favicon.svg',
  '/icons/apple-touch-icon-180x180.png',
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching offline page and assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting on install');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Pre-caching failed:', error);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          }
          return null; 
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients for current version');
      return self.clients.claim();
    })
  );
});

// Fetch event - Enhanced for PWA navigation
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Handle navigation requests (page requests) - Critical for PWA
  if (event.request.mode === 'navigate') {
    console.log('[Service Worker] Navigation request intercepted:', event.request.url);
    
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          console.log('[Service Worker] Navigation served from network:', event.request.url);
          
          // Cache navigation responses for offline usage
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          
          return response;
        })
        .catch(() => {
          console.log('[Service Worker] Navigation failed, serving from cache or fallback');
          
          // Try to serve from cache first
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[Service Worker] Serving navigation from cache');
              return cachedResponse;
            }
            
            // Fallback to app shell (index.html) for SPA navigation
            return caches.match('/index.html').then((appShell) => {
              if (appShell) {
                console.log('[Service Worker] Serving app shell for navigation');
                return appShell;
              }
              
              // Ultimate fallback - offline page
              return new Response(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <title>Heresse - Offline</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover">
                    <meta name="apple-mobile-web-app-capable" content="yes">
                    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
                    <style>
                      body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                        text-align: center; 
                        padding: 50px 20px; 
                        background: #0a0a0b;
                        color: #ffffff;
                        margin: 0;
                        height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                      }
                      .offline { 
                        max-width: 320px;
                      }
                      h1 {
                        color: #ec4899;
                        margin-bottom: 20px;
                      }
                      .retry-btn {
                        background: #ec4899;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        margin-top: 20px;
                        cursor: pointer;
                        font-size: 16px;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="offline">
                      <h1>Heresse</h1>
                      <p>Vous êtes hors ligne. Veuillez vérifier votre connexion Internet.</p>
                      <button class="retry-btn" onclick="window.location.reload()">Réessayer</button>
                    </div>
                  </body>
                </html>
              `, {
                headers: { 
                  'Content-Type': 'text/html',
                  'Cache-Control': 'no-cache'
                }
              });
            });
          });
        })
    );
    return;
  }

  // Handle asset requests (JS, CSS, images, etc.)
  if (event.request.destination === 'style' || 
      event.request.destination === 'script' || 
      event.request.destination === 'image' ||
      event.request.destination === 'font' ||
      PRECACHE_ASSETS.some(asset => event.request.url.includes(asset))) {
    
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            console.log('[Service Worker] Asset served from cache:', event.request.url);
            return response;
          }
          
          // Fetch from network and cache
          return fetch(event.request).then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Cache successful responses
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
            console.log('[Service Worker] Asset served from network and cached:', event.request.url);
            return networkResponse;
          });
        })
        .catch(error => {
          console.error('[Service Worker] Asset fetch error:', error);
          
          // Return appropriate fallbacks for failed assets
          if (event.request.destination === 'image') {
            return new Response('', { status: 404, statusText: 'Image not found' });
          }
          
          // For CSS/JS, return empty response to prevent breaking the app
          if (event.request.destination === 'style') {
            return new Response('', { 
              headers: { 'Content-Type': 'text/css' },
              status: 404 
            });
          }
          
          if (event.request.destination === 'script') {
            return new Response('', { 
              headers: { 'Content-Type': 'application/javascript' },
              status: 404 
            });
          }
          
          throw error;
        })
    );
  }
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notify clients when a new version is available
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'SW_ACTIVATED',
          message: 'Service Worker activated'
        });
      });
    })
  );
});