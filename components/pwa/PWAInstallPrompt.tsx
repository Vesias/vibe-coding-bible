'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePWA } from '@/lib/pwa/hooks'
import { 
  Smartphone, 
  Download, 
  X, 
  Zap, 
  Wifi, 
  Bell, 
  Sparkles,
  CheckCircle,
  Star
} from 'lucide-react'

interface PWAInstallPromptProps {
  onInstall?: () => void
  onDismiss?: () => void
  className?: string
}

export function PWAInstallPrompt({ 
  onInstall, 
  onDismiss, 
  className = '' 
}: PWAInstallPromptProps) {
  const { isInstallable, isInstalled, isStandalone, installApp } = usePWA()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return
    
    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    const dismissedDate = dismissed ? new Date(dismissed) : null
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

    // Show prompt if installable and not recently dismissed
    if (isInstallable && !isInstalled && !isStandalone) {
      if (!dismissedDate || dismissedDate < threeDaysAgo) {
        setTimeout(() => setIsVisible(true), 2000) // Show after 2 seconds
      }
    }
  }, [isInstallable, isInstalled, isStandalone])

  const handleInstall = async () => {
    setIsInstalling(true)
    
    try {
      const success = await installApp()
      
      if (success) {
        setIsVisible(false)
        onInstall?.()
        
        // Track installation
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'pwa_install', {
            method: 'install_prompt'
          })
        }
      }
    } catch (error) {
      console.error('Installation failed:', error)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    
    // Remember dismissal for 3 days (only on client-side)
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwa-install-dismissed', new Date().toISOString())
    }
    
    onDismiss?.()
    
    // Track dismissal
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pwa_install_dismissed')
    }
  }

  if (!isVisible || isDismissed || isInstalled || isStandalone) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ type: "spring", duration: 0.5 }}
        className={`fixed bottom-4 left-4 right-4 z-50 ${className}`}
      >
        <Card className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 backdrop-blur-md border border-blue-600/30 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* App Icon */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Smartphone className="h-8 w-8 text-white" />
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    App installieren
                  </h3>
                  <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    PWA
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Installiere die Vibe Coding Bible als App für das beste Lernerlebnis!
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <Wifi className="h-3 w-3 text-green-600" />
                    Offline verfügbar
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <Zap className="h-3 w-3 text-sacred-tech-gold" />
                    Schneller Start
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <Bell className="h-3 w-3 text-sacred-electric-indigo" />
                    Push-Benachrichtigungen
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <Star className="h-3 w-3 text-sacred-gold" />
                    Native App-Feeling
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-black font-medium flex-1"
                  >
                    {isInstalling ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                      </motion.div>
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    {isInstalling ? 'Installiere...' : 'Installieren'}
                  </Button>

                  <Button
                    onClick={handleDismiss}
                    variant="outline"
                    size="sm"
                    className="bg-black/20 border-sacred-digital-white/20 text-sacred-digital-white hover:bg-black/40"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

// Success notification after installation
export function PWAInstallSuccess() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Listen for app installation
    const handleAppInstalled = () => {
      setIsVisible(true)
      setTimeout(() => setIsVisible(false), 5000)
    }

    window.addEventListener('appinstalled', handleAppInstalled)
    
    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="fixed top-4 right-4 z-50"
      >
        <Card className="bg-gradient-to-br from-sacred-matrix-green/20 to-sacred-matrix-green/10 backdrop-blur-md border border-sacred-matrix-green/30 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-10 h-10 bg-sacred-matrix-green/20 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="h-5 w-5 text-green-600" />
              </motion.div>
              
              <div>
                <h4 className="text-sm font-medium text-sacred-digital-white">
                  App erfolgreich installiert!
                </h4>
                <p className="text-xs text-gray-600">
                  Vibe Coding Bible ist jetzt auf deinem Gerät verfügbar
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

// Minimal install button for header/menu
export function PWAInstallButton({ variant = 'default' }: { variant?: 'default' | 'minimal' }) {
  const { isInstallable, installApp } = usePWA()
  const [isInstalling, setIsInstalling] = useState(false)

  if (!isInstallable) return null

  const handleInstall = async () => {
    setIsInstalling(true)
    await installApp()
    setIsInstalling(false)
  }

  if (variant === 'minimal') {
    return (
      <Button
        onClick={handleInstall}
        disabled={isInstalling}
        variant="outline"
        size="sm"
        className="bg-black/20 border-sacred-gold/30 text-sacred-gold hover:bg-sacred-gold/10"
      >
        <Download className="h-4 w-4 mr-2" />
        App installieren
      </Button>
    )
  }

  return (
    <Button
      onClick={handleInstall}
      disabled={isInstalling}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-black font-medium"
    >
      {isInstalling ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Download className="h-4 w-4 mr-2" />
        </motion.div>
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {isInstalling ? 'Installiere...' : 'Als App installieren'}
    </Button>
  )
}