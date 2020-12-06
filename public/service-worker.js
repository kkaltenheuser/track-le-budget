var CACHE_NAME = "my-site-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";
// cache these urls
var urlsToCache = [
  "/",
  "./db.js",
  "./index.js",
  "./manifest.json",
  "./styles.css",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png"
];
// install event listener
self.addEventListener("install", function(event) {
  // install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
        console.log("Opened cache");
        // cache these urls
      return cache.addAll(urlsToCache);
    })
  );
});
// fetch function on event listener
self.addEventListener("fetch", function(event) {
  // cache all get requests to api
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(response => {
            // If positive response, put in cache
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            // if error, return/request from cache
            return cache.match(event.request);
          });
      }).catch(err => console.log(err))
    );

    return;
  }

    // upon event
  event.respondWith(
      fetch(event.request).catch(function () {
        // fetch and return request
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          // return the cache match
          return caches.match("/");
        }
      });
    })
  );
});
