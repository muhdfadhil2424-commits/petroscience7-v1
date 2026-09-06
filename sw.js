const CACHE_NAME = 'edusense-v2';

// Fasa Install
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Fasa Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fasa Fetch: Simpan ke Cache secara automatik sewaktu ONLINE
self.addEventListener('fetch', (event) => {
  // Hanya simpan request GET (panggilan fail)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Guna fail dari cache jika offline
      }

      return fetch(event.request).then((response) => {
        // Jika response sah, simpan satu salinan ke dalam cache
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Jika internet terputus dan tiada cache, elakkan crash
        console.log('Offline: Fail tidak dijumpai dalam cache', event.request.url);
      });
    })
  );
});