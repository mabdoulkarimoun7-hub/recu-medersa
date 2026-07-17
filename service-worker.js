const CACHE_NAME = "recu-medersa-v18";
const APP_SHELL = [
  "./",
  "./index.html",
  "./app/style.css",
  "./app/config.js",
  "./app/i18n.js",
  "./app/firebase-config.js",
  "./app/storage.js",
  "./app/modules-manager.js",
  "./app/app.js",
  "./app/attendance.js",
  "./app/pdf-export.js",
  "./app/print-escpos.js",
  "./manifest.json",
  "./assets/logo.png",
  "./assets/midenty-logo.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

const BYPASS_PATTERNS = [
  "/clients/",
  "firebaseio.com",
  "googleapis.com",
  "gstatic.com/firebasejs",
  "firestore.googleapis.com",
  "identitytoolkit.googleapis.com",
  "securetoken.googleapis.com"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (BYPASS_PATTERNS.some(p => url.includes(p))) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
