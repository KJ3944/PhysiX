/**
 * PhysiX Service Worker
 * App-shell caching strategy for offline-first experience
 * Caches: HTML, CSS, JS, fonts, images, manifest
 * Runtime caches: Firebase Auth, Google Fonts, Firebase Firestore
 */

const CACHE_NAME = 'physix-v2';
const APP_SHELL_CACHE = 'physix-app-shell-v2';
const RUNTIME_CACHE = 'physix-runtime-v2';

// App shell resources to precache
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons.svg',
  '/cursor.png',
  '/offline.html'
];

// Install event - precache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      console.log('[SW] Precaching app shell');
      return cache.addAll(APP_SHELL_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== APP_SHELL_CACHE && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first strategy for navigation requests (HTML)
async function networkFirstNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    // Network failed or offline, proceed to cache checks below
  }

  // 1. Try matching the exact requested URL in cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // 2. SPA client-side fallback: Return cached /index.html so all SPA routes function offline
  const appShell = (await caches.match('/index.html')) || (await caches.match('/'));
  if (appShell) {
    return appShell;
  }

  // 3. Fallback to offline page for un-cached first-time visitors
  const offlinePage = await caches.match('/offline.html');
  if (offlinePage) {
    return offlinePage;
  }

  return new Response('PhysiX is offline', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Stale-while-revalidate for static assets (CSS, JS, images, fonts)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Cache-first for fonts and images (immutable resources)
async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// Network-only for Firebase Auth and API calls (must be fresh)
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Determine strategy based on request
function getStrategy(request) {
  const url = new URL(request.url);

  // Navigation requests (HTML pages) - network first
  if (request.mode === 'navigate') {
    return networkFirstNavigation;
  }

  // Firebase Auth endpoints - network only (must be fresh)
  if (url.hostname.includes('firebaseauth.googleapis.com') ||
      url.hostname.includes('securetoken.googleapis.com') ||
      url.hostname.includes('identitytoolkit.googleapis.com')) {
    return networkOnly;
  }

  // Firebase Firestore - network only (no offline persistence or caching)
  if (url.hostname.includes('firestore.googleapis.com')) {
    return networkOnly;
  }

  // Google Fonts - cache first (immutable)
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    return cacheFirst;
  }

  // API calls to Express backend - network only
  if (url.pathname.startsWith('/api/')) {
    return networkOnly;
  }

  // Static assets (JS, CSS, images) - stale while revalidate
  if (request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'image' ||
      request.destination === 'font') {
    return staleWhileRevalidate;
  }

  // Default: network first
  return networkFirstNavigation;
}

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http schemes
  if (!request.url.startsWith('http')) {
    return;
  }

  const strategy = getStrategy(request);
  event.respondWith(strategy(request));
});

// Message event for skip waiting
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});