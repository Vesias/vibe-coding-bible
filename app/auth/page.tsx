'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AuthForm } from '@/components/auth/AuthForms'
import { useAuth } from '@/lib/auth/AuthProvider'

function AuthPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  useEffect(() => {
    // Set mode based on URL parameter
    const paramMode = searchParams.get('mode')
    if (paramMode === 'signup' || paramMode === 'signin') {
      setMode(paramMode)
    }
    
    // Redirect if already authenticated
    if (!loading && user) {
      const redirectTo = searchParams.get('redirectTo') || '/dashboard'
      router.push(redirectTo)
    }
  }, [searchParams, user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[url('/sacred-geometry-pattern.svg')] opacity-10"></div>
      <div className="relative z-10 w-full">
        <AuthForm mode={mode} onModeChange={setMode} />
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  )
}