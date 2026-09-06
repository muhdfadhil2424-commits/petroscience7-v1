const CACHE_NAME = 'edusense-v6';

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

// Fasa Install: Simpan fail secara selamat
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        CORE_ASSETS.map((asset) => 
          fetch(asset)
            .then((response) => {
              if (response.ok) return cache.put(asset, response);
            })
            .catch((err) => console.log('Gagal cache asset:', asset, err))
        )
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

// Fasa Fetch: Ambil dari Cache dahulu, jika tiada baru buat fetch (Offline First)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Ambil terus dari cache jika wujud
      }

      // Jika tiada dalam cache, cuba ambil dari internet
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Menghalang unhandled promise rejection semasa offline
          return new Response('Offline and resource not found in cache', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
    })
  );
});