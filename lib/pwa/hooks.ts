'use client'

import { useState, useEffect, useCallback } from 'react'

// PWA Installation Hook
export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if running in standalone mode (only on client)
    if (typeof window === 'undefined') return
    
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                     (window.navigator as any).standalone ||
                     document.referrer.includes('android-app://')
    
    setIsStandalone(standalone)
    setIsInstalled(standalone)

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installApp = useCallback(async () => {
    if (!deferredPrompt) return false

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setIsInstallable(false)
        setDeferredPrompt(null)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Install failed:', error)
      return false
    }
  }, [deferredPrompt])

  return {
    isInstallable,
    isInstalled,
    isStandalone,
    installApp
  }
}

// Service Worker Hook
export function useServiceWorker() {
  const [isSupported, setIsSupported] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if ('serviceWorker' in navigator) {
      setIsSupported(true)
      registerServiceWorker()
    }

    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const registerServiceWorker = async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      })

      setRegistration(reg)
      setIsRegistered(true)

      // Check for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true)
            }
          })
        }
      })

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'WORKSHOP_CACHED') {
          console.log('Workshop cached offline:', event.data.workshopId)
        }
      })

      console.log('Service Worker registered successfully')
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }

  const updateServiceWorker = useCallback(async () => {
    if (registration) {
      try {
        await registration.update()
        
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
          window.location.reload()
        }
      } catch (error) {
        console.error('Service Worker update failed:', error)
      }
    }
  }, [registration])

  const cacheWorkshop = useCallback((workshopId: string) => {
    if (registration && registration.active) {
      registration.active.postMessage({
        type: 'CACHE_WORKSHOP',
        workshopId
      })
    }
  }, [registration])

  const getCacheStatus = useCallback((): Promise<any> => {
    return new Promise((resolve) => {
      if (registration && registration.active) {
        const channel = new MessageChannel()
        
        channel.port1.onmessage = (event) => {
          if (event.data.type === 'CACHE_STATUS') {
            resolve(event.data)
          }
        }
        
        registration.active.postMessage(
          { type: 'GET_CACHE_STATUS' },
          [channel.port2]
        )
      } else {
        resolve(null)
      }
    })
  }, [registration])

  return {
    isSupported,
    isRegistered,
    updateAvailable,
    isOnline,
    updateServiceWorker,
    cacheWorkshop,
    getCacheStatus
  }
}

// Network Status Hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionType, setConnectionType] = useState<string>('unknown')
  const [effectiveType, setEffectiveType] = useState<string>('4g')

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    const updateConnectionInfo = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection

      if (connection) {
        setConnectionType(connection.type || 'unknown')
        setEffectiveType(connection.effectiveType || '4g')
      }
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo)
    }

    updateOnlineStatus()
    updateConnectionInfo()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo)
      }
    }
  }, [])

  return {
    isOnline,
    connectionType,
    effectiveType,
    isSlowConnection: effectiveType === 'slow-2g' || effectiveType === '2g'
  }
}

// Offline Storage Hook (for workshop progress, AI chat, etc.)
export function useOfflineStorage(key: string) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [key])

  const loadData = async () => {
    try {
      const stored = localStorage.getItem(`offline_${key}`)
      if (stored) {
        setData(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load offline data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveData = useCallback(async (newData: any) => {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify(newData))
      setData(newData)
      
      // Schedule background sync if supported
      if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready
        if ((registration as any).sync) {
          await (registration as any).sync.register(`${key}-sync`)
        }
      }
    } catch (error) {
      console.error('Failed to save offline data:', error)
    }
  }, [key])

  const clearData = useCallback(async () => {
    try {
      localStorage.removeItem(`offline_${key}`)
      setData(null)
    } catch (error) {
      console.error('Failed to clear offline data:', error)
    }
  }, [key])

  return {
    data,
    isLoading,
    saveData,
    clearData
  }
}

// Push Notifications Hook
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window
    setIsSupported(supported)

    if (supported) {
      checkSubscription()
    }
  }, [])

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const existingSubscription = await registration.pushManager.getSubscription()
      
      if (existingSubscription) {
        setSubscription(existingSubscription)
        setIsSubscribed(true)
      }
    } catch (error) {
      console.error('Failed to check push subscription:', error)
    }
  }

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }

  const subscribe = async (): Promise<boolean> => {
    if (!isSupported) return false

    try {
      const hasPermission = await requestPermission()
      if (!hasPermission) return false

      const registration = await navigator.serviceWorker.ready
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY || 'default-key'
      })

      setSubscription(newSubscription)
      setIsSubscribed(true)

      // Send subscription to server
      await fetch('/api/pwa/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: newSubscription, action: 'subscribe' })
      })

      return true
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return false
    }
  }

  const unsubscribe = async (): Promise<boolean> => {
    if (!subscription) return false

    try {
      await subscription.unsubscribe()
      setSubscription(null)
      setIsSubscribed(false)

      // Remove subscription from server
      await fetch('/api/pwa/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, action: 'unsubscribe' })
      })

      return true
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      return false
    }
  }

  return {
    isSupported,
    isSubscribed,
    subscribe,
    unsubscribe,
    requestPermission
  }
}