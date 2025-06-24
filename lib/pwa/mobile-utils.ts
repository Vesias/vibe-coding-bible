'use client'

// PWA and Mobile Utility Functions

export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isPWA: boolean
  isStandalone: boolean
  isIOS: boolean
  isAndroid: boolean
  orientation: 'portrait' | 'landscape'
  connectionType: string
  isOnline: boolean
}

export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isPWA: false,
      isStandalone: false,
      isIOS: false,
      isAndroid: false,
      orientation: 'landscape',
      connectionType: 'unknown',
      isOnline: true
    }
  }

  const userAgent = navigator.userAgent
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent)
  const isIOS = /iPad|iPhone|iPod/.test(userAgent)
  const isAndroid = /Android/.test(userAgent)
  
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone ||
                document.referrer.includes('android-app://')

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches

  const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  const connectionType = connection ? connection.effectiveType || connection.type : 'unknown'

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    isPWA,
    isStandalone,
    isIOS,
    isAndroid,
    orientation,
    connectionType,
    isOnline: navigator.onLine
  }
}

export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function isLowEndDevice(): boolean {
  const connection = (navigator as any).connection
  const memory = (navigator as any).deviceMemory
  const cores = navigator.hardwareConcurrency

  // Consider device low-end if:
  // - Less than 4GB RAM
  // - Less than 4 CPU cores
  // - Slow connection (2g/slow-2g)
  return (
    (memory && memory < 4) ||
    (cores && cores < 4) ||
    (connection && ['slow-2g', '2g'].includes(connection.effectiveType))
  )
}

export function getViewportHeight(): number {
  // Account for mobile browser UI
  return window.visualViewport?.height || window.innerHeight
}

export function getSafeAreaInsets() {
  const style = getComputedStyle(document.documentElement)
  
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0')
  }
}

// Vibration API wrapper
export function vibrate(pattern: number | number[]): boolean {
  if ('vibrate' in navigator) {
    try {
      return navigator.vibrate(pattern)
    } catch (error) {
      console.warn('Vibration failed:', error)
      return false
    }
  }
  return false
}

// Haptic feedback patterns
export const hapticPatterns = {
  light: [10],
  medium: [20],
  heavy: [50],
  success: [10, 50, 10],
  error: [50, 100, 50],
  warning: [30, 50, 30],
  click: [5],
  doubleClick: [5, 20, 5],
  longPress: [10, 30, 10]
}

// Screen wake lock
export async function requestWakeLock(): Promise<WakeLockSentinel | null> {
  if ('wakeLock' in navigator) {
    try {
      const wakeLock = await (navigator as any).wakeLock.request('screen')
      console.log('Screen wake lock activated')
      return wakeLock
    } catch (error) {
      console.warn('Wake lock failed:', error)
      return null
    }
  }
  return null
}

// Orientation utilities
export function lockOrientation(orientation: 'portrait' | 'landscape'): Promise<void> {
  if (screen.orientation && (screen.orientation as any).lock) {
    return (screen.orientation as any).lock(orientation)
  }
  return Promise.reject('Orientation lock not supported')
}

export function unlockOrientation(): void {
  if (screen.orientation && (screen.orientation as any).unlock) {
    (screen.orientation as any).unlock()
  }
}

// Battery API
export async function getBatteryInfo(): Promise<any> {
  if ('getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery()
      return {
        level: Math.round(battery.level * 100),
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime
      }
    } catch (error) {
      console.warn('Battery API failed:', error)
      return null
    }
  }
  return null
}

// Performance monitoring
export function measurePerformance(name: string): () => number {
  const startTime = performance.now()
  
  return () => {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    // Log performance metric
    if ('PerformanceObserver' in window) {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
    }
    
    return duration
  }
}

// Memory usage
export function getMemoryUsage(): any {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
    }
  }
  return null
}

// Network information
export function getNetworkInfo(): any {
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection

  if (connection) {
    return {
      effectiveType: connection.effectiveType,
      type: connection.type,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    }
  }
  
  return {
    effectiveType: 'unknown',
    type: 'unknown',
    downlink: null,
    rtt: null,
    saveData: false
  }
}

// Adaptive loading based on device capabilities
export function shouldReduceMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function shouldReduceData(): boolean {
  const connection = (navigator as any).connection
  return connection?.saveData || 
         ['slow-2g', '2g'].includes(connection?.effectiveType) ||
         isLowEndDevice()
}

export function getOptimalImageQuality(): 'low' | 'medium' | 'high' {
  const device = getDeviceInfo()
  const network = getNetworkInfo()
  
  if (shouldReduceData() || network.effectiveType === 'slow-2g' || network.effectiveType === '2g') {
    return 'low'
  }
  
  if (device.isMobile || network.effectiveType === '3g') {
    return 'medium'
  }
  
  return 'high'
}

// Touch gesture utilities
export interface TouchGesture {
  startX: number
  startY: number
  endX: number
  endY: number
  deltaX: number
  deltaY: number
  direction: 'up' | 'down' | 'left' | 'right' | 'none'
  distance: number
  duration: number
}

export function detectSwipeGesture(
  startTouch: Touch,
  endTouch: Touch,
  startTime: number,
  endTime: number,
  threshold: number = 50
): TouchGesture {
  const deltaX = endTouch.clientX - startTouch.clientX
  const deltaY = endTouch.clientY - startTouch.clientY
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  const duration = endTime - startTime

  let direction: TouchGesture['direction'] = 'none'
  
  if (distance > threshold) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left'
    } else {
      direction = deltaY > 0 ? 'down' : 'up'
    }
  }

  return {
    startX: startTouch.clientX,
    startY: startTouch.clientY,
    endX: endTouch.clientX,
    endY: endTouch.clientY,
    deltaX,
    deltaY,
    direction,
    distance,
    duration
  }
}

// URL sharing
export async function shareUrl(data: {
  title?: string
  text?: string
  url?: string
  files?: File[]
}): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(data)
      return true
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Sharing failed:', error)
      }
      return false
    }
  }
  
  // Fallback to clipboard
  if (data.url && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(data.url)
      return true
    } catch (error) {
      console.error('Clipboard write failed:', error)
      return false
    }
  }
  
  return false
}

// App installation utilities
export function getInstallPromptEvent(): any {
  return (window as any).deferredPrompt
}

export function setInstallPromptEvent(event: any): void {
  (window as any).deferredPrompt = event
}

export function clearInstallPromptEvent(): void {
  (window as any).deferredPrompt = null
}

// Storage utilities
export function getStorageQuota(): Promise<StorageEstimate | null> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    return navigator.storage.estimate()
  }
  return Promise.resolve(null)
}

export async function requestPersistentStorage(): Promise<boolean> {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    try {
      return await navigator.storage.persist()
    } catch (error) {
      console.warn('Persistent storage request failed:', error)
      return false
    }
  }
  return false
}