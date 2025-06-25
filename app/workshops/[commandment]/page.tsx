'use client'

import { useState, useEffect } from 'react'
import { getWorkshopById, getAllWorkshops } from '@/lib/workshop/commandments'
import SacredWorkshopEngine from '@/components/workshop/SacredWorkshopEngine'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Crown, ArrowLeft, ArrowRight, Home, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ commandment: string }>
}

// Workshop Navigation Component with Enhanced Logic
const WorkshopNavigation = ({ currentWorkshop }: { currentWorkshop: any }) => {
  const allWorkshops = getAllWorkshops()
  const currentIndex = allWorkshops.findIndex(w => w.id === currentWorkshop.id)
  const previousWorkshop = currentIndex > 0 ? allWorkshops[currentIndex - 1] : null
  const nextWorkshop = currentIndex < allWorkshops.length - 1 ? allWorkshops[currentIndex + 1] : null

  // Check prerequisites for next workshop
  const checkPrerequisites = (workshop: any): boolean => {
    if (!workshop || !workshop.prerequisites) return true
    
    // Check if we're on the client side
    if (typeof window === 'undefined') return false
    
    // Get completed workshops from localStorage
    const progressData = localStorage.getItem('vibe-coding-progress')
    if (!progressData) return workshop.prerequisites.length === 0
    
    try {
      const progress = JSON.parse(progressData)
      const completedWorkshops = progress.globalProgress?.completedWorkshops || []
      
      // Check if all prerequisites are completed
      return workshop.prerequisites.every((prereq: string) => 
        completedWorkshops.includes(prereq)
      )
    } catch {
      return workshop.prerequisites.length === 0
    }
  }

  const canAccessNext = nextWorkshop ? checkPrerequisites(nextWorkshop) : false

  // Calculate overall progress
  const getOverallProgress = (): number => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return 0
    
    const progressData = localStorage.getItem('vibe-coding-progress')
    if (!progressData) return 0
    
    try {
      const progress = JSON.parse(progressData)
      const completedWorkshops = progress.globalProgress?.completedWorkshops || []
      return Math.round((completedWorkshops.length / allWorkshops.length) * 100)
    } catch {
      return 0
    }
  }

  const overallProgress = typeof window !== 'undefined' ? getOverallProgress() : 0

  return (
    <div className="sticky top-0 z-50 backdrop-blur-sm border-b" style={{
      background: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#475569'
    }}>
      {/* Progress Bar */}
      <div className="w-full h-1" style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
        <div 
          className="h-full transition-all duration-500"
          style={{
            width: `${overallProgress}%`,
            background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)'
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Previous Workshop */}
          <div className="flex-1">
            {previousWorkshop ? (
              <Link href={`/workshops/${previousWorkshop.id}`}>
                <Button variant="ghost" className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
                  <ArrowLeft className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-xs" style={{ color: '#64748b' }}>Previous</div>
                    <div style={{ color: '#FFCE00' }}>{previousWorkshop.title}</div>
                  </div>
                </Button>
              </Link>
            ) : (
              <div></div>
            )}
          </div>

          {/* Center: Current Workshop + Home */}
          <div className="flex items-center gap-4">
            <Link href="/workshops">
              <Button variant="ghost" size="sm" className="flex items-center gap-2" style={{ color: '#94a3b8' }}>
                <Home className="w-4 h-4" />
                Alle Workshops
              </Button>
            </Link>
            <div className="text-center">
              <div className="text-xs" style={{ color: '#64748b' }}>
                Commandment {currentWorkshop.commandmentNumber} • {overallProgress}% Complete
              </div>
              <div className="font-semibold" style={{ color: '#FFCE00' }}>{currentWorkshop.title}</div>
            </div>
          </div>

          {/* Right: Next Workshop */}
          <div className="flex-1 flex justify-end">
            {nextWorkshop ? (
              canAccessNext ? (
                <Link href={`/workshops/${nextWorkshop.id}`}>
                  <Button variant="ghost" className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
                    <div className="text-right">
                      <div className="text-xs" style={{ color: '#64748b' }}>Next</div>
                      <div style={{ color: '#FFCE00' }}>{nextWorkshop.title}</div>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <div className="text-right opacity-50">
                  <div className="text-xs" style={{ color: '#64748b' }}>Locked</div>
                  <div className="text-sm" style={{ color: '#94a3b8' }}>
                    🔒 {nextWorkshop.title}
                  </div>
                  <div className="text-xs" style={{ color: '#64748b' }}>
                    Complete prerequisites first
                  </div>
                </div>
              )
            ) : (
              <div className="text-right">
                <div className="text-xs" style={{ color: '#64748b' }}>Congratulations!</div>
                <div className="text-sm" style={{ color: '#FFCE00' }}>
                  🏆 All workshops completed
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommandmentPage({ params }: PageProps) {
  const [workshopId, setWorkshopId] = useState<string>('')
  const [workshop, setWorkshop] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadWorkshop = async () => {
      const resolvedParams = await params
      const id = resolvedParams.commandment.toLowerCase()
      setWorkshopId(id)
      
      const workshopData = getWorkshopById(id)
      setWorkshop(workshopData)
      setLoading(false)
    }
    
    loadWorkshop()
  }, [params])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }
  
  if (!workshop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <Card className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-red-500/30 p-8">
            <CardContent className="text-center space-y-4">
              <Crown className="h-16 w-16 text-red-400 mx-auto" />
              <h1 className="text-2xl font-bold text-white mb-4">Sacred Workshop Not Found</h1>
              <p className="text-blue-200 mb-6">
                The requested commandment "{workshopId}" does not exist in our sacred library.
              </p>
              <Button asChild className="bg-gradient-to-r from-yellow-500/30 to-purple-600/30 hover:from-yellow-500/50 hover:to-purple-600/50">
                <Link href="/workshops">← Return to Sacred Workshops</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%)' 
    }}>
      <WorkshopNavigation currentWorkshop={workshop} />
      <SacredWorkshopEngine workshop={workshop} />
    </div>
  )
}

// SEO metadata removed due to 'use client' directive requirement
