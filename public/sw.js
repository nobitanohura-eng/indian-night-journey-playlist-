// Indian Night Journey PWA Service Worker
const CACHE_NAME = 'inj-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass through fetch for high-speed dynamic audio & image streaming
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
