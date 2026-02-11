// Neon Dash Service Worker
const CACHE_NAME = 'neon-dash-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './mobile.css',
    './constants.js',
    './themes.js',
    './levels.js',
    './particle.js',
    './enemy.js',
    './sound.js',
    './highscores.js',
    './achievements.js',
    './settings.js',
    './game.js',
    './i18n.js',
    './mobile.js',
    './levelEditor.js',
    './favicon.svg',
    './favicon-32x32.png',
    './apple-touch-icon.png',
    './manifest.json'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching app assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip external requests (Google Fonts, etc.)
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone the response for caching
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(event.request);
            })
    );
});
