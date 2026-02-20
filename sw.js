// Neon Dash Service Worker
const CACHE_NAME = 'neon-dash-v1.1';
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
    './icon-192.png',
    './icon-512.png',
    './manifest.json',
    // Levels
    './levels/BD1__l9_greed.json',
    './levels/BD1_pack.json',
    './levels/BD1_pack_int.json',
    './levels/banyasz_odusszeia_world1.json',
    './levels/bd1.json',
    './levels/bd_cave02.json',
    './levels/bg1_1clone.json',
    './levels/labirintus_pack.json',
    './levels/mely_magja_sablon_pack.json',
    './levels/mely_magja_sablon_pack_javitott.json'
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

// Fetch event - network-first for local origin, fallback to cache
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Only handle local requests
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // If we got a valid response, cache it and return it
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(event.request);
            })
    );
});
