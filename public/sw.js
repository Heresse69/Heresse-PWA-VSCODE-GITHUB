// Service Worker pour rendre l'app utilisable hors ligne
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('heresse-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/static/js/bundle.js',
        '/static/css/main.css',
        // ...autres ressources
      ]);
    })
  );
});
