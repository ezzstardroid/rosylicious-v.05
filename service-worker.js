const CACHE_NAME = "rosylicious-cache-v3";
const APP_SHELL = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Cache the app shell one file at a time so one missing optional file
    // cannot prevent the service worker from installing.
    for (const url of APP_SHELL) {
      try {
        const response = await fetch(url, { cache: "reload" });
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        // Continue installing; the browser can fetch the page online.
      }
    }

    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith("rosylicious-cache-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle same-origin GET requests.
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // For page navigation, try the network first and fall back to cached app.
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put("./index.html", response.clone());
        }
        return response;
      } catch (error) {
        return (await caches.match(request)) ||
               (await caches.match("./index.html")) ||
               Response.error();
      }
    })());
    return;
  }

  // For other same-origin files, prefer cache and then use the network.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  })());
});
