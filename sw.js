const CACHE_NAME = 'edusense-v9';

const CORE_ASSETS = [
  './',
  './index.html',
  './logo.jpeg',
  './goyang-dumang.mp3',
  './video-pecahan.mp4',
  './video-pecahan-2.mp4',
  './js/tf.min.js',
  './js/teachablemachine-image.min.js',
  './js/posenet.min.js',
  './js/teachablemachine-pose.min.js',
  './models/emotion/model.json',
  './models/emotion/metadata.json',
  './models/emotion/weights.bin',
  './models/pose/model.json',
  './models/pose/metadata.json',
  './models/pose/weights.bin'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        CORE_ASSETS.map((asset) => 
          fetch(asset)
            .then((response) => {
              if (response.ok) return cache.put(asset, response);
              throw new Error(`HTTP ${response.status}`);
            })
            .catch((err) => console.log('Gagal cache asset:', asset, err))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;
  if (requestUrl.pathname.endsWith('/sw.js')) return;

  const isHTML = event.request.mode === 'navigate' ||
    requestUrl.pathname.endsWith('.html') ||
    requestUrl.pathname === '/';

  if (isHTML) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      }).catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});