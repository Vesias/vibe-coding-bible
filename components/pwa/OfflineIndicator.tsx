'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useNetworkStatus, useServiceWorker } from '@/lib/pwa/hooks'
import { 
  Wifi, 
  WifiOff, 
  Sync, 
  Download, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Smartphone,
  HardDrive,
  Signal
} from 'lucide-react'

interface OfflineIndicatorProps {
  className?: string
  showDetails?: boolean
}

export function OfflineIndicator({ 
  className = '', 
  showDetails = false 
}: OfflineIndicatorProps) {
  const { isOnline, connectionType, effectiveType, isSlowConnection } = useNetworkStatus()
  const { isRegistered, updateAvailable, getCacheStatus, updateServiceWorker } = useServiceWorker()
  const [showOfflineNotice, setShowOfflineNotice] = useState(false)
  const [cacheInfo, setCacheInfo] = useState<any>(null)
  const [syncProgress, setSyncProgress] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineNotice(true)
      loadCacheInfo()
    } else {
      // Hide notice after a delay when coming back online
      setTimeout(() => setShowOfflineNotice(false), 3000)
    }
  }, [isOnline])

  useEffect(() => {
    if (showDetails && isRegistered) {
      loadCacheInfo()
    }
  }, [showDetails, isRegistered])

  const loadCacheInfo = async () => {
    try {
      const info = await getCacheStatus()
      setCacheInfo(info)
    } catch (error) {
      console.error('Failed to load cache info:', error)
    }
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await updateServiceWorker()
    } catch (error) {
      console.error('Update failed:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getConnectionIcon = () => {
    if (!isOnline) return WifiOff
    if (isSlowConnection) return Signal
    return Wifi
  }

  const getConnectionColor = () => {
    if (!isOnline) return 'text-red-500'
    if (isSlowConnection) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getConnectionText = () => {
    if (!isOnline) return 'Offline'
    if (isSlowConnection) return `Langsam (${effectiveType})`
    return `Online (${effectiveType})`
  }

  // Compact indicator for header/navigation
  if (!showDetails) {
    const ConnectionIcon = getConnectionIcon()
    
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <ConnectionIcon className={`h-4 w-4 ${getConnectionColor()}`} />
        {!isOnline && (
          <Badge variant="outline" className="bg-red-500/20 border-red-500/30 text-red-400 text-xs">
            Offline
          </Badge>
        )}
        {updateAvailable && (
          <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-400 text-xs animate-pulse">
            Update
          </Badge>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Detailed Status Card */}
      <Card className={`bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-sacred-gold/20 ${className}`}>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${
                  isOnline 
                    ? 'from-green-500/20 to-green-600/20' 
                    : 'from-red-500/20 to-red-600/20'
                }`}>
                  <Wifi className={`h-4 w-4 ${getConnectionColor()}`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-sacred-digital-white">
                    Verbindungsstatus
                  </h3>
                  <p className="text-xs text-sacred-digital-white/70">
                    {getConnectionText()}
                  </p>
                </div>
              </div>
              
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  isOnline 
                    ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                    : 'bg-red-500/20 border-red-500/30 text-red-400'
                }`}
              >
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>

            {/* Service Worker Status */}
            {isRegistered && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20">
                    <Smartphone className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-sacred-digital-white">
                      PWA Service Worker
                    </h3>
                    <p className="text-xs text-sacred-digital-white/70">
                      Offline-Funktionen aktiv
                    </p>
                  </div>
                </div>
                
                <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-400 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Aktiv
                </Badge>
              </div>
            )}

            {/* Cache Information */}
            {cacheInfo && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20">
                    <HardDrive className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-sacred-digital-white">
                      Offline-Speicher
                    </h3>
                    <p className="text-xs text-sacred-digital-white/70">
                      {cacheInfo.totalSize} in {cacheInfo.caches} Caches
                    </p>
                  </div>
                </div>
                
                <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-400 text-xs">
                  {cacheInfo.totalSize}
                </Badge>
              </div>
            )}

            {/* Update Available */}
            {updateAvailable && (
              <div className="p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-sacred-digital-white">
                      Update verfügbar
                    </span>
                  </div>
                  <Button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    size="sm"
                    className="bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                  >
                    {isUpdating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sync className="h-3 w-3" />
                      </motion.div>
                    ) : (
                      'Aktualisieren'
                    )}
                  </Button>
                </div>
                <p className="text-xs text-sacred-digital-white/70">
                  Eine neue Version der App ist verfügbar
                </p>
              </div>
            )}

            {/* Sync Progress */}
            {syncProgress > 0 && syncProgress < 100 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sacred-digital-white">Synchronisiere...</span>
                  <span className="text-xs text-sacred-digital-white/70">{syncProgress}%</span>
                </div>
                <Progress value={syncProgress} className="h-1" />
              </div>
            )}

            {/* Connection Quality Warning */}
            {isOnline && isSlowConnection && (
              <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-sacred-digital-white">
                    Langsame Verbindung
                  </span>
                </div>
                <p className="text-xs text-sacred-digital-white/70">
                  Einige Features sind möglicherweise eingeschränkt
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Offline Notice Toast */}
      <AnimatePresence>
        {showOfflineNotice && !isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-md border border-red-500/30 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center"
                  >
                    <WifiOff className="h-4 w-4 text-red-400" />
                  </motion.div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-sacred-digital-white">
                      Offline-Modus aktiviert
                    </h4>
                    <p className="text-xs text-sacred-digital-white/70">
                      Deine Daten werden automatisch synchronisiert, sobald du wieder online bist
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Online Notice */}
      <AnimatePresence>
        {showOfflineNotice && isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-md border border-green-500/30 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </motion.div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-sacred-digital-white">
                      Wieder online!
                    </h4>
                    <p className="text-xs text-sacred-digital-white/70">
                      Synchronisiere deine Offline-Aktivitäten...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}