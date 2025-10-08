const CACHE_NAME = 'pedidos-online-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install Event
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Estratégia Cache First
self.addEventListener('fetch', (event) => {
  // Ignora requisições não GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna do cache se encontrou
        if (response) {
          return response;
        }

        // Faz requisição para a rede
        return fetch(event.request)
          .then((response) => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta para adicionar ao cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Fallback para página offline
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Sync Event - Para sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync iniciado');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Aqui você pode implementar sincronização de dados offline
  console.log('Sincronizando dados em background...');
}