'use client'

import { useEffect } from 'react'
import { PWAInstallPrompt, PWAInstallSuccess } from '@/components/pwa/PWAInstallPrompt'
import { OfflineIndicator } from '@/components/pwa/OfflineIndicator'
import { useServiceWorker } from '@/lib/pwa/hooks'

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const { isSupported, isRegistered } = useServiceWorker()

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return
    
    // Register service worker on load
    if (isSupported && !isRegistered) {
      console.log('PWA: Initializing service worker...')
    }

    // Handle PWA lifecycle events
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: Install prompt available')
    }

    const handleAppInstalled = (e: Event) => {
      console.log('PWA: App installed successfully')
      
      // Track installation
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pwa_install_success', {
          method: 'browser_prompt'
        })
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isSupported, isRegistered])

  return (
    <>
      {children}
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* PWA Install Success Notification */}
      <PWAInstallSuccess />
      
      {/* Global Offline Indicator */}
      <div className="fixed top-20 right-4 z-40">
        <OfflineIndicator />
      </div>
    </>
  )
}