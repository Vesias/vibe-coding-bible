'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          setStatus('error')
          setMessage(errorDescription || 'Authentication failed')
          return
        }

        if (code) {
          // Handle OAuth code exchange
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            setStatus('error')
            setMessage(exchangeError.message)
            return
          }

          if (data.user) {
            // Check if user profile exists
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single()

            if (profileError && profileError.code === 'PGRST116') {
              // User doesn't exist, create profile
              const { error: insertError } = await supabase
                .from('users')
                .insert({
                  id: data.user.id,
                  email: data.user.email!,
                  full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
                  avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
                  subscription_status: 'free',
                  prophet_rank: 'novice',
                  total_xp: 0,
                  current_level: 1,
                  github_username: data.user.user_metadata?.user_name || data.user.user_metadata?.preferred_username,
                  learning_preferences: {}
                })

              if (insertError) {
                console.error('Error creating user profile:', insertError)
                // Continue anyway, profile can be created later
              }
            }

            setStatus('success')
            setMessage('Successfully authenticated! Redirecting to your dashboard...')
            
            // Redirect after a short delay
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
            return
          }
        }

        // Handle email confirmation
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          setStatus('error')
          setMessage(sessionError.message)
          return
        }

        if (sessionData.session) {
          setStatus('success')
          setMessage('Email confirmed successfully! Redirecting to your dashboard...')
          
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } else {
          setStatus('error')
          setMessage('No valid session found')
        }

      } catch (error: any) {
        setStatus('error')
        setMessage(error.message || 'An unexpected error occurred')
      }
    }

    handleAuthCallback()
  }, [searchParams, router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
            {status === 'loading' && <LoadingSpinner size="lg" />}
            {status === 'success' && <span className="text-2xl">✨</span>}
            {status === 'error' && <span className="text-2xl">⚠️</span>}
          </div>
          
          <CardTitle className="text-xl">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Welcome to the Brotherhood!'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
          
          <CardDescription>
            {status === 'loading' && 'Please wait while we complete your authentication'}
            {status === 'success' && 'Your divine coding journey begins now'}
            {status === 'error' && 'There was an issue with your authentication'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
          
          {status === 'error' && (
            <div className="space-y-2">
              <Button 
                onClick={() => router.push('/auth')}
                className="w-full"
              >
                Try Again
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/')}
                className="w-full"
                size="sm"
              >
                Return Home
              </Button>
            </div>
          )}
          
          {status === 'loading' && (
            <div className="space-y-2">
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Completing your sacred authentication ritual...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
            <CardTitle className="text-xl">Authenticating...</CardTitle>
            <CardDescription>Please wait while we complete your authentication</CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}