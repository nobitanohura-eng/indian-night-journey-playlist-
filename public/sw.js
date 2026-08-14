// Indian Night Journey PWA Service Worker
const CACHE_NAME = 'inj-pwa-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Completely bypass Service Worker for MP3 audio files to enable native HTTP 206 Range streaming in PWA standalone mode
  if (event.request.url.endsWith('.mp3') || event.request.url.includes('/music/') || event.request.url.includes('/audio/') || event.request.url.includes('/horns/')) {
    return;
  }
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
