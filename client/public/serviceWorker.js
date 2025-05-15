const cacheName = 'MyApp_01'

const filesToCache =
    ['index.html', 
	 'logo192.png'
    ]


// Start the service worker and cache the files in the array filesToCache[] 
window.self.addEventListener('install', e =>
{
    e.waitUntil(caches.open(cacheName)
    .then(cache => cache.addAll(filesToCache)))
})



// delete old versions of the cache when a new version is first loaded 
window.self.addEventListener('activate', event => 
{
    event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.map(key => 
    {
        if(!cacheName.includes(key)) 
		{
            return caches.delete(key)
        }
    }))))
})



// fetch offline cached first, then online, then offline error page 
window.self.addEventListener('fetch', function (e) 
{
    e.respondWith(caches.match(e.request)
    .then(function (response)
    {
        if (response) // file found in cache
        {
            return response
        }

        // Retrieve url from www
        return fetch(e.request)
    })
    .catch(function (e)
    {
        // offline and not in cache
        return caches.match('offline.html')
    })
)})