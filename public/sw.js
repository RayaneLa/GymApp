const CACHE_NAME = "gym-app-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/src/App.css",
    "/src/App.jsx",
    "/src/index.css",
    "/src/main.jsx",
];

// Install service worker and cache files
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});

// Serve cached content when offline
self.addEventListener("fetch", (event) => {
    event.respondWith(
      fetch(event.request).catch(() => new Response("Offline", { status: 503 }))
    );
  });
  

// Update cache when new service worker is installed
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});
