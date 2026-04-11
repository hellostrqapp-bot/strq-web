// ═══════════════════════════════════════════════════════════
// strQ — Service Worker
// Strategy: stale-while-revalidate for assets, network-first
// for API calls, offline fallback for navigation.
// ═══════════════════════════════════════════════════════════

const CACHE_NAME = 'strq-v1';
const OFFLINE_URL = '/offline';

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/offline',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
];

// ── Install: pre-cache essential assets ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Activate immediately, don't wait for old SW to die
  self.skipWaiting();
});

// ── Activate: clean old caches ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});

// ── Fetch: smart strategy per request type ──
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Supabase API calls — always network
  if (url.hostname.includes('supabase')) return;

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') return;

  // Navigation requests → network-first, offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful page loads
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(() => {
          // Offline → try cache, then fallback
          return caches.match(request).then((cached) => {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // Static assets (JS, CSS, images) → stale-while-revalidate
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.match(/\.(js|css|png|jpg|svg|ico|woff2?)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, clone);
              });
            }
            return response;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }
});
