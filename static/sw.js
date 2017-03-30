var VERSION = 1;
var STATIC_CACHE_NAME = 'static' + VERSION;
var ORIGIN = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');

var STATIC_FILES = [
	ORIGIN + '/',
	ORIGIN + '/css/app.css',
	ORIGIN + '/css/libs.css',
	ORIGIN + '/js/libs.js',

];

var STATIC_FILE_URL_HASH = {};

STATIC_FILES.forEach(function(file){
	STATIC_FILE_URL_HASH[file] = true;
});

self.addEventListener('install', function(evt) {
	evt.waitUntil(
		caches.open(STATIC_CACHE_NAME).then(function(cache) {
			return Promise.all(STATIC_FILES.map(function(url) {
				return fetch(new Request(url)).then(function(response) {
					if (response.ok)
						return cache.put(response.url, response);
					return Promise.reject(
						'Invalid response.  URL:' + response.url +
						' Status: ' + response.status);
				});
			}));
		}));
});

self.addEventListener('fetch', function(evt) {
	if (!STATIC_FILE_URL_HASH[evt.request.url])
		return;
	evt.respondWith(caches.match(evt.request, {cacheName: STATIC_CACHE_NAME}));
});