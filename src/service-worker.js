import { timestamp, files, shell, routes } from '@sapper/service-worker';

// https://www.pwabuilder.com/serviceworker
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');


// if (workbox) {
//   console.log(`Workbox is loaded!!`);
// } else {
//   console.log(`Workbox failed to load`);
// }

const offlineFallbackPage = "/routes/offline";


const ASSETS = `cache${timestamp}`;

// `shell` is an array of all the files generated by the bundler,
// `files` is an array of everything in the `static` directory
const to_cache = shell.concat(files);
const cached = new Set(to_cache);

self.addEventListener('install', event => {
	event.waitUntil(
		caches
			.open(ASSETS)
			.then(cache => cache.addAll(to_cache))
			.then(() => {
				self.skipWaiting();
			})
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(async keys => {
			// delete old caches
			for (const key of keys) {
				if (key !== ASSETS) await caches.delete(key);
			}

			self.clients.claim();
		})
	);
});

self.addEventListener('fetch', event => {
	// console.log('[SW] Fetch event:', event.request.url, event.request.method, event.request.headers.has('range'), event.request.cache)
	if (event.request.method !== 'GET' || event.request.headers.has('range')) return;

	const url = new URL(event.request.url);


	// don't try to handle e.g. data: URIs
	if (!url.protocol.startsWith('http')) return;
	// console.log('11111')

	// ignore dev server requests
	if (url.hostname === self.location.hostname && url.port !== self.location.port) return;

	// console.log('222222')
	// always serve static files and bundler-generated assets from cache
	if (url.host === self.location.host && cached.has(url.pathname)) {
		event.respondWith(caches.match(event.request));
		return;
	}

	// console.log('33333')
	// for pages, you might want to serve a shell `service-worker-index.html` file,
	// which Sapper has generated for you. It's not right for every
	// app, but if it's right for yours then uncomment this section
	/*
	if (url.origin === self.origin && routes.find(route => route.pattern.test(url.pathname))) {
		event.respondWith(caches.match('/service-worker-index.html'));
		return;
	}
	*/

	if (event.request.cache === 'only-if-cached') return;

	// console.log('44444')
	// for everything else, try the network first, falling back to
	// cache if the user is offline. (If the pages never change, you
	// might prefer a cache-first approach to a network-first one.)
	// event.respondWith(
	// 	caches
	// 		.open(`offline${timestamp}`)
	// 		.then(async cache => {
	// 			try {
	// 				const response = await fetch(event.request);
	// 				cache.put(event.request, response.clone());
	// 				return response;
	// 			} catch(err) {
	// 				const response = await cache.match(event.request);
	// 				if (response) return response;

	// 				throw err;
	// 			}
	// 		})
	// );

	// use SWR: https://dev.to/paco_ita/service-workers-and-caching-strategies-explained-step-3-m4f
	// event.respondWith(
	// 	caches
	// 		.open(`offline${timestamp}`)
	// 		.then(async cache => {
	// 			try {
	// 				const response = await cache.match(event.request);
	// 				console.log('[SW] fetch:: cache found:', response)
	// 				if (response) return response;
	// 				throw new Error('no cache')

	// 			} catch(err) {
	// 				const response = await fetch(event.request);
	// 				cache.put(event.request, response.clone());
	// 				console.log('[SW] fetch:: no cache found; adding:', response)
	// 				return response;

	// 				throw err;
	// 			}
	// 		})
	// );

	event.respondWith(
		caches
			.open(`offline${timestamp}`)
			.then(async cache => {
				try {
					// if cache exists
					let response = await cache.match(event.request);
					// console.log('[SW] fetch:: cache found:', response)
					if (response) return response;
					// throw new Error('no cache')


					// if cache doesn't exist, grab from network
					response = await fetch(event.request);
					cache.put(event.request, response.clone());
					// console.log('[SW] fetch:: no cache found; adding:', response)
					if (response) return response;


					// if nothing exists, show offline mode
					console.log('[SW] Offline mode')
					response = await cache.match(offlineFallbackPage)
					return response

				} catch(err) {
					throw err;
				}
			})
	);

});




workbox.loadModule('workbox-cacheable-response');
workbox.loadModule('workbox-range-requests');


// notion-derived assets

workbox.routing.registerRoute(
  new RegExp('^http://localhost:2024/api/notion/asset/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'media-cache',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('^https://open-phage.vercel.app.'),
  new workbox.strategies.CacheFirst({
    cacheName: 'media-cache',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      })
    ]
  })
);





workbox.routing.registerRoute(
  new RegExp('^https://s3.us-west-2.amazonaws.com/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'media-cache',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('^https://dl.airtable.com/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'media-cache',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      })
    ]
  })
);
// workbox.routing.registerRoute(
//   new RegExp('/api/notion/asset'),
//   new workbox.strategies.CacheFirst({
//     cacheName: 'media-cache',
//     plugins: [
//       new workbox.cacheableResponse.CacheableResponsePlugin({
//         statuses: [0, 200],
//       })
//     ]
//   })
// );

workbox.routing.registerRoute(
  // new RegExp('^https://dl.airtable.com'),
  /\.(?:png|jpg|jpeg|svg|mp4|webm)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'media-cache',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60 * 4,  // 4 * 7 days
      }),
    ]
  })
);


workbox.routing.registerRoute(
  // new RegExp('^https://dl.airtable.com'),
  /\.(?:css)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'css-cache',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60 * 4,  // 4 * 7 days
      }),
    ]
  })
);

