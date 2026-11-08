const CACHE_VERSION = 'ship-inn-pwa-v1'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const IMAGE_CACHE = `${CACHE_VERSION}-images`
const PAGES_CACHE = `${CACHE_VERSION}-pages`

const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/images/the_ship_inn2.avif',
  '/images/the_ship_inn2.webp',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Never cache CMS or Admin or API routes
  if (
    url.pathname.startsWith('/outstatic') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api')
  ) {
    return
  }

  // 1. Images (.avif, .webp, icons) & PDF Menus -> Stale-While-Revalidate
  if (
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/menus/')
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request)
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone())
            }
            return response
          })
          .catch(() => cached)

        return cached || networkFetch
      })
    )
    return
  }

  // 2. HTML Page Navigations -> Network-First with Cache & /offline.html Fallback
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone()
            caches.open(PAGES_CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(async () => {
          const cachedPage = await caches.match(request)
          if (cachedPage) return cachedPage
          return caches.match('/offline.html')
        })
    )
    return
  }

  // 3. Static JS/CSS/Fonts -> Stale-While-Revalidate
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/fonts/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request)
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone())
            }
            return response
          })
          .catch(() => cached)

        return cached || networkFetch
      })
    )
  }
})

