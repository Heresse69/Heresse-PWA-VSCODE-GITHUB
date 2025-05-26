/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'heresse-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/favicon.svg',
  '/icons/apple-touch-icon-180x180.png',
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png'
];

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

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            console.log('[Service Worker] Serving from cache:', event.request.url);
            return response;
          }
          return fetch(event.request)
            .then((networkResponse) => {
              console.log('[Service Worker] Serving from network:', event.request.url);
              return networkResponse;
            })
            .catch(() => {
              console.log('[Service Worker] Fetch failed, serving offline page from cache for navigation');
              return caches.match('/index.html'); 
            });
        })
    );
    return;
  }

  if (PRECACHE_ASSETS.some(asset => event.request.url.endsWith(asset.substring(asset.lastIndexOf('/')))) || event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            console.log('[Service Worker] Serving asset from cache:', event.request.url);
            return response;
          }
          return fetch(event.request).then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            console.log('[Service Worker] Serving asset from network and caching:', event.request.url);
            return networkResponse;
          });
        })
        .catch(error => {
          console.error('[Service Worker] Error fetching asset:', error);
          
        })
    );
  }
});