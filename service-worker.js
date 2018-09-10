// reference to https://www.youtube.com/watch?v=ksXwaWHCW6k

const cacheName = "v1";
// call install event
self.addEventListener("install", e => {
  console.log("Service Worker: Installed!");
});

// Call Activate Event
self.addEventListener("activate", e => {
  console.log("SW: activated");
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log("SW: clear old cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// call fetch event
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const responseClone = res.clone();
        caches.open(cacheName).then(cache => {
          // add response to cache
          cache.put(e.request, responseClone);
        });
        return res;
      })
      .catch(err => {
        caches.match(e.request).then(res => res);
      })
  );
});
