'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// Mock types to replace Supabase types
interface MockUser {
  id: string
  email?: string
}

interface MockUserProfile {
  id: string
  full_name?: string
  prophet_rank?: string
  total_xp?: number
  subscription_status?: string
  email?: string
  avatar_url?: string
}

interface AuthContextType {
  user: MockUser | null
  profile: MockUserProfile | null
  loading: boolean
  error: any | null
  isAuthenticated: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  redirectToSignIn: (redirectTo?: string) => void
  redirectAfterAuth: (defaultPath?: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Mock state - no user logged in for public access
  const [user, setUser] = useState<MockUser | null>(null)
  const [profile, setProfile] = useState<MockUserProfile | null>(null)
  const [loading, setLoading] = useState(false) // No loading needed for mock
  const [error, setError] = useState<any | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const isAuthenticated = !!user

  const refreshProfile = useCallback(async () => {
    // Mock: no-op for now
    console.log('Mock: refreshProfile called')
  }, [user])

  const signOut = useCallback(async () => {
    // Mock: clear state and redirect
    setUser(null)
    setProfile(null)
    setError(null)
    router.push('/')
  }, [router])

  const redirectToSignIn = useCallback((redirectTo?: string) => {
    const currentPath = redirectTo || (pathname !== '/auth/signin' && pathname !== '/auth/signup' ? pathname : undefined)
    const signInUrl = currentPath ? `/auth/signin?redirectTo=${encodeURIComponent(currentPath)}` : '/auth/signin'
    router.push(signInUrl)
  }, [router, pathname])

  const redirectAfterAuth = useCallback((defaultPath = '/dashboard') => {
    // Get the redirect URL from the current URL or use default
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const redirectTo = urlParams.get('redirectTo') || defaultPath
      
      // Avoid redirecting to auth pages
      if (redirectTo.startsWith('/auth/')) {
        router.push(defaultPath)
      } else {
        router.push(redirectTo)
      }
    } else {
      router.push(defaultPath)
    }
  }, [router])

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      error,
      isAuthenticated,
      signOut,
      refreshProfile,
      redirectToSignIn,
      redirectAfterAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}