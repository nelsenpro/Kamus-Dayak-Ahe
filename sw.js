const CACHE_NAME = 'kamus-dayak-cache-v1';
const urlsToCache = [
  '/kd/',
  '/kd/index.html',
  '/kd/style.css',
  '/kd/app.js',
  '/kd/manifest.json',
  '/kd/favicon.ico',
  '/kd/icon-192.png',
  '/kd/icon-512.png'
];

// Install Event - Menyimpan asset ke cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Menyimpan aset ke cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch Event - Mengambil resource dari cache atau jaringan
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.pathname.endsWith('/data-max.json')) {
    event.respondWith(fetchNetworkFirst(event.request));
  } else {
    event.respondWith(fetchCacheFirst(event.request));
  }
});

// Strategi network-first
const fetchNetworkFirst = (request) => {
  return fetch(request)
    .then((networkResponse) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      });
    })
    .catch(() => caches.match(request)); // fallback ke cache jika offline
};

// Strategi cache-first
const fetchCacheFirst = (request) => {
  return caches.match(request).then((cachedResponse) => {
    return cachedResponse || fetch(request);
  });
};

// Activate Event - Menghapus cache lama
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});