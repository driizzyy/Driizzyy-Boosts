// Service Worker for Driizzyy Boosts PWA
const CACHE_NAME = 'driizzyy-boosts-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/css/enhanced-styles.css',
    '/assets/css/order-tracking.css',
    '/assets/css/mobile-app.css',
    '/assets/js/main.js',
    '/assets/js/enhanced-features.js',
    '/assets/js/order-tracking.js',
    '/assets/js/mobile-app.js',
    '/config/site.json',
    '/config/advanced-config.js',
    '/assets/images/favicon.ico'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Push notification event
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Your Discord boost is ready!',
        icon: '/assets/images/icon-192.png',
        badge: '/assets/images/badge-72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Order',
                icon: '/assets/images/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/images/xmark.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Driizzyy Boosts', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        // Open the app and navigate to orders
        event.waitUntil(
            clients.openWindow('/?utm_source=notification&utm_campaign=boost_ready')
        );
    }
});

// Background sync for offline orders
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // Handle offline order submissions
    return new Promise((resolve) => {
        console.log('Background sync triggered');
        resolve();
    });
}
