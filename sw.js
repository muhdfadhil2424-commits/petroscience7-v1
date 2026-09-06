const CACHE_NAME = 'edusense-v5';

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

// Fasa Install: Simpan fail satu per satu (kalis ralat)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        CORE_ASSETS.map((asset) => cache.add(asset))
      );
    })
  );
  self.skipWaiting();
});

// Fasa Activate: Padam cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fasa Fetch: Buka dari Cache semasa Offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});