const CACHE_NAME = 'edusense-offline-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
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

// Phase Install: Simpan semua fail ke dalam Cache Browser
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Phase Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Phase Fetch: Ambil fail dari Cache dahulu jika tiada Internet (Offline)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});