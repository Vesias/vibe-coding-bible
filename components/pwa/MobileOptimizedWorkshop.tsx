'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useServiceWorker, useOfflineStorage } from '@/lib/pwa/hooks'
import { 
  Play, 
  Pause, 
  Download, 
  CheckCircle, 
  Clock, 
  Wifi, 
  WifiOff, 
  Bookmark, 
  Share2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Save,
  Smartphone
} from 'lucide-react'

interface MobileOptimizedWorkshopProps {
  workshop: {
    id: string
    title: string
    description: string
    duration: number
    progress: number
    isCompleted: boolean
    isCached?: boolean
  }
  onStart?: () => void
  onContinue?: () => void
  onComplete?: () => void
  className?: string
}

export function MobileOptimizedWorkshop({
  workshop,
  onStart,
  onContinue,
  onComplete,
  className = ''
}: MobileOptimizedWorkshopProps) {
  const { cacheWorkshop } = useServiceWorker()
  const { data: offlineProgress, saveData } = useOfflineStorage(`workshop_${workshop.id}`)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isCaching, setIsCaching] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [touchStartY, setTouchStartY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect mobile device
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    
    // Handle orientation changes
    const handleOrientationChange = () => {
      // Force viewport update on orientation change
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 100)
    }

    window.addEventListener('orientationchange', handleOrientationChange)
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  const handleCacheWorkshop = async () => {
    setIsCaching(true)
    try {
      cacheWorkshop(workshop.id)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate caching delay
    } catch (error) {
      console.error('Failed to cache workshop:', error)
    } finally {
      setIsCaching(false)
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: workshop.title,
          text: workshop.description,
          url: `/workshops/${workshop.id}`,
        })
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${workshop.title}\n${window.location.origin}/workshops/${workshop.id}`)
        alert('Link in die Zwischenablage kopiert!')
      }
    } catch (error) {
      console.error('Sharing failed:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY
    const deltaY = touchStartY - touchY

    // Pull-to-refresh gesture
    if (deltaY < -100 && window.scrollY === 0) {
      // Trigger refresh
      window.location.reload()
    }
  }

  const saveOfflineProgress = async (progress: number) => {
    await saveData({
      workshopId: workshop.id,
      progress,
      lastAccessed: new Date().toISOString(),
      completed: progress >= 100
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <Card className="bg-gradient-to-br from-black/60 to-black/80 backdrop-blur-sm border border-sacred-gold/20 overflow-hidden">
        {/* Mobile Header */}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-bold text-sacred-digital-white line-clamp-2">
                {workshop.title}
              </CardTitle>
              <p className="text-sm text-sacred-digital-white/70 mt-1 line-clamp-2">
                {workshop.description}
              </p>
            </div>
            
            {/* Status Indicators */}
            <div className="flex flex-col gap-2">
              {workshop.isCached && (
                <Badge className="bg-green-500/20 border-green-500/30 text-green-400 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
              {workshop.isCompleted && (
                <Badge className="bg-sacred-gold/20 border-sacred-gold/30 text-sacred-gold text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Abgeschlossen
                </Badge>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sacred-digital-white/70">Fortschritt</span>
              <span className="text-sacred-gold font-medium">{workshop.progress}%</span>
            </div>
            <Progress 
              value={workshop.progress} 
              className="h-2 bg-black/40" 
            />
          </div>

          {/* Workshop Meta */}
          <div className="flex items-center gap-4 text-xs text-sacred-digital-white/70">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{workshop.duration} Min</span>
            </div>
            {isMobile && (
              <div className="flex items-center gap-1">
                <Smartphone className="h-3 w-3" />
                <span>Mobil optimiert</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Primary Action */}
            <Button
              onClick={workshop.progress > 0 ? onContinue : onStart}
              className="bg-gradient-to-r from-sacred-gold to-sacred-tech-gold hover:from-sacred-tech-gold hover:to-sacred-gold text-black font-medium"
            >
              {workshop.progress > 0 ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Fortsetzen
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Starten
                </>
              )}
            </Button>

            {/* Cache Button */}
            <Button
              onClick={handleCacheWorkshop}
              disabled={isCaching || workshop.isCached}
              variant="outline"
              className="bg-black/20 border-sacred-electric-indigo/30 text-sacred-electric-indigo hover:bg-sacred-electric-indigo/10"
            >
              {isCaching ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Download className="h-4 w-4 mr-2" />
                </motion.div>
              ) : workshop.isCached ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Gespeichert
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Offline
                </>
              )}
            </Button>
          </div>

          {/* Mobile-Specific Features */}
          <div className="flex gap-2">
            {/* Share Button */}
            <Button
              onClick={handleShare}
              disabled={isSharing}
              variant="outline"
              size="sm"
              className="bg-black/20 border-sacred-purple/30 text-sacred-purple hover:bg-sacred-purple/10 flex-1"
            >
              <Share2 className="h-3 w-3 mr-2" />
              Teilen
            </Button>

            {/* Bookmark Button */}
            <Button
              variant="outline"
              size="sm"
              className="bg-black/20 border-sacred-gold/30 text-sacred-gold hover:bg-sacred-gold/10"
            >
              <Bookmark className="h-3 w-3" />
            </Button>

            {/* Fullscreen Toggle */}
            {isMobile && (
              <Button
                onClick={toggleFullscreen}
                variant="outline"
                size="sm"
                className="bg-black/20 border-sacred-digital-white/30 text-sacred-digital-white hover:bg-black/40"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-3 w-3" />
                ) : (
                  <Maximize2 className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>

          {/* Offline Status */}
          {offlineProgress && (
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <WifiOff className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-sacred-digital-white">
                  Offline-Fortschritt gespeichert
                </span>
              </div>
              <p className="text-xs text-sacred-digital-white/70">
                Letzter Zugriff: {new Date(offlineProgress.lastAccessed).toLocaleDateString('de-DE')}
              </p>
            </div>
          )}

          {/* Quick Actions for Mobile */}
          {isMobile && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-black/20 border-sacred-matrix-green/30 text-sacred-matrix-green hover:bg-sacred-matrix-green/10 text-xs p-2"
              >
                <Save className="h-3 w-3 mb-1" />
                Speichern
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="bg-black/20 border-sacred-tech-gold/30 text-sacred-tech-gold hover:bg-sacred-tech-gold/10 text-xs p-2"
              >
                <RotateCcw className="h-3 w-3 mb-1" />
                Neu starten
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="bg-black/20 border-sacred-electric-indigo/30 text-sacred-electric-indigo hover:bg-sacred-electric-indigo/10 text-xs p-2"
              >
                <Wifi className="h-3 w-3 mb-1" />
                Sync
              </Button>
            </div>
          )}
        </CardContent>

        {/* Touch-friendly navigation hints */}
        {isMobile && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-1 bg-sacred-digital-white/30 rounded-full" />
          </div>
        )}
      </Card>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 flex items-center justify-center"
          >
            <div className="text-center text-sacred-digital-white p-8">
              <h2 className="text-2xl font-bold mb-4">{workshop.title}</h2>
              <p className="text-sacred-digital-white/70 mb-8">Vollbild-Modus aktiviert</p>
              <Button
                onClick={toggleFullscreen}
                className="bg-gradient-to-r from-sacred-gold to-sacred-tech-gold text-black"
              >
                <Minimize2 className="h-4 w-4 mr-2" />
                Vollbild verlassen
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}