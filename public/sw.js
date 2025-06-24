// Vibe Coding Bible - Service Worker
// Advanced PWA Service Worker with Offline Support and Caching Strategies

const CACHE_NAME = 'vibe-coding-bible-v1.0.0'
const STATIC_CACHE = 'vibe-static-v1.0.0'
const DYNAMIC_CACHE = 'vibe-dynamic-v1.0.0'
const API_CACHE = 'vibe-api-v1.0.0'

// Cache strategies for different resource types
const CACHE_STRATEGIES = {
  static: ['/', '/dashboard', '/workshops', '/community', '/ai-mentor'],
  assets: ['/manifest.json', '/icons/', '/images/'],
  api: ['/api/ai/', '/api/workshops/', '/api/community/'],
  fonts: ['https://fonts.googleapis.com/', 'https://fonts.gstatic.com/'],
  external: ['https://vercel.com/', 'https://supabase.co/']
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...')
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll([
          '/',
          '/manifest.json',
          '/icons/icon-192x192.png',
          '/icons/icon-512x512.png',
          '/offline.html',
          '/_next/static/css/',
          '/_next/static/js/'
        ].filter(Boolean))
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...')
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, API_CACHE].includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') return
  
  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) return
  
  event.respondWith(handleFetch(request, url))
})

async function handleFetch(request, url) {
  try {
    // API requests - Network First with Cache Fallback
    if (url.pathname.startsWith('/api/')) {
      return await networkFirstStrategy(request, API_CACHE)
    }
    
    // Static assets - Cache First
    if (isStaticAsset(url)) {
      return await cacheFirstStrategy(request, STATIC_CACHE)
    }
    
    // Dynamic content - Stale While Revalidate
    if (isDynamicContent(url)) {
      return await staleWhileRevalidateStrategy(request, DYNAMIC_CACHE)
    }
    
    // External resources - Network First
    if (isExternalResource(url)) {
      return await networkFirstStrategy(request, DYNAMIC_CACHE)
    }
    
    // Default - Network First with Cache Fallback
    return await networkFirstStrategy(request, DYNAMIC_CACHE)
    
  } catch (error) {
    console.error('[SW] Fetch error:', error)
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/offline.html')
      return offlineResponse || new Response('Offline - Please check your connection', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      })
    }
    
    // Return empty response for other requests
    return new Response('', { status: 200 })
  }
}

// Cache First Strategy - for static assets
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    // Update cache in background
    updateCacheInBackground(request, cacheName)
    return cachedResponse
  }
  
  // Not in cache, fetch from network
  const networkResponse = await fetch(request)
  
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName)
    cache.put(request, networkResponse.clone())
  }
  
  return networkResponse
}

// Network First Strategy - for API calls
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
    
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url)
    
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    throw error
  }
}

// Stale While Revalidate Strategy - for dynamic content
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request)
  
  // Always try to fetch fresh content in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(cacheName)
      cache.then(c => c.put(request, networkResponse.clone()))
    }
    return networkResponse
  }).catch(() => {
    // Network failed, ignore
  })
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse
  }
  
  // Wait for network if no cache
  return await fetchPromise
}

// Update cache in background
async function updateCacheInBackground(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
  } catch (error) {
    // Ignore background update errors
    console.log('[SW] Background update failed:', request.url)
  }
}

// Helper functions to categorize requests
function isStaticAsset(url) {
  return (
    url.pathname.includes('/_next/static/') ||
    url.pathname.includes('/icons/') ||
    url.pathname.includes('/images/') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname === '/manifest.json'
  )
}

function isDynamicContent(url) {
  return (
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/workshops') ||
    url.pathname.startsWith('/community') ||
    url.pathname.startsWith('/ai-mentor')
  )
}

function isExternalResource(url) {
  return (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('vercel.com') ||
    url.hostname.includes('supabase.co')
  )
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)
  
  if (event.tag === 'workshop-progress-sync') {
    event.waitUntil(syncWorkshopProgress())
  }
  
  if (event.tag === 'ai-chat-sync') {
    event.waitUntil(syncAIChat())
  }
})

async function syncWorkshopProgress() {
  try {
    // Get offline workshop progress from IndexedDB
    const offlineProgress = await getOfflineWorkshopProgress()
    
    if (offlineProgress.length > 0) {
      // Sync with server
      for (const progress of offlineProgress) {
        await fetch('/api/workshops/sync-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(progress)
        })
      }
      
      // Clear offline storage
      await clearOfflineWorkshopProgress()
      
      console.log('[SW] Workshop progress synced:', offlineProgress.length, 'items')
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error)
  }
}

async function syncAIChat() {
  try {
    // Get offline AI chat messages from IndexedDB
    const offlineMessages = await getOfflineAIMessages()
    
    if (offlineMessages.length > 0) {
      // Sync with server
      for (const message of offlineMessages) {
        await fetch('/api/ai/sync-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message)
        })
      }
      
      // Clear offline storage
      await clearOfflineAIMessages()
      
      console.log('[SW] AI chat synced:', offlineMessages.length, 'messages')
    }
  } catch (error) {
    console.error('[SW] AI sync failed:', error)
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event)
  
  const options = {
    body: event.data ? event.data.text() : 'Neue Updates verfügbar!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'vibe-coding-notification',
    actions: [
      {
        action: 'open',
        title: 'Öffnen',
        icon: '/icons/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'Schließen',
        icon: '/icons/action-close.png'
      }
    ],
    data: {
      url: event.data ? JSON.parse(event.data.text()).url : '/'
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('Vibe Coding Bible', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event)
  
  event.notification.close()
  
  if (event.action === 'dismiss') {
    return
  }
  
  const urlToOpen = event.notification.data?.url || '/'
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        // Check if app is already open
        for (const client of clients) {
          if (client.url.includes(self.location.origin)) {
            client.focus()
            client.navigate(urlToOpen)
            return
          }
        }
        
        // Open new window
        return self.clients.openWindow(urlToOpen)
      })
  )
})

// Message handling for client communication
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_WORKSHOP') {
    event.waitUntil(cacheWorkshop(event.data.workshopId))
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    event.waitUntil(sendCacheStatus(event.ports[0]))
  }
})

async function cacheWorkshop(workshopId) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    const workshopUrl = `/workshops/${workshopId}`
    
    await cache.add(workshopUrl)
    console.log('[SW] Workshop cached:', workshopId)
    
    // Notify client
    const clients = await self.clients.matchAll()
    clients.forEach(client => {
      client.postMessage({
        type: 'WORKSHOP_CACHED',
        workshopId
      })
    })
  } catch (error) {
    console.error('[SW] Workshop cache failed:', error)
  }
}

async function sendCacheStatus(port) {
  try {
    const cacheNames = await caches.keys()
    const totalSize = await calculateCacheSize(cacheNames)
    
    port.postMessage({
      type: 'CACHE_STATUS',
      caches: cacheNames.length,
      totalSize: formatBytes(totalSize),
      version: CACHE_NAME
    })
  } catch (error) {
    console.error('[SW] Cache status failed:', error)
  }
}

async function calculateCacheSize(cacheNames) {
  let totalSize = 0
  
  for (const name of cacheNames) {
    const cache = await caches.open(name)
    const requests = await cache.keys()
    
    for (const request of requests) {
      const response = await cache.match(request)
      if (response) {
        const blob = await response.blob()
        totalSize += blob.size
      }
    }
  }
  
  return totalSize
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// IndexedDB helpers for offline storage
async function getOfflineWorkshopProgress() {
  // Implementation would use IndexedDB to store offline progress
  return []
}

async function clearOfflineWorkshopProgress() {
  // Implementation would clear IndexedDB offline progress
}

async function getOfflineAIMessages() {
  // Implementation would use IndexedDB to store offline AI messages
  return []
}

async function clearOfflineAIMessages() {
  // Implementation would clear IndexedDB offline AI messages
}

console.log('[SW] Service Worker loaded successfully')