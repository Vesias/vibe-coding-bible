'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { BookOpen, CheckCircle, AlertCircle } from 'lucide-react'

function SeamlessAuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    handleSeamlessAuth()
  }, [])

  const handleSeamlessAuth = async () => {
    try {
      const token = searchParams.get('token')
      const source = searchParams.get('source')
      const destination = searchParams.get('destination') || 'dashboard'

      if (!token || source !== 'agentland') {
        throw new Error('Invalid authentication request')
      }

      // Validate token with Agentland
      const response = await fetch(`${process.env.NEXT_PUBLIC_AGENTLAND_URL}/api/vibecoding/auth?token=${token}`)
      
      if (!response.ok) {
        throw new Error('Token validation failed')
      }

      const { valid, userId, email, metadata } = await response.json()

      if (!valid) {
        throw new Error('Invalid or expired token')
      }

      // Create or update user session
      const supabase = createClient()
      
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (!existingUser) {
        // Create new user with Agentland connection
        await supabase.from('users').insert({
          email,
          full_name: metadata.fullName || email.split('@')[0],
          agentland_user_id: userId,
          prophet_rank: 'seeker',
          metadata: {
            source: 'agentland',
            seamlessAuth: true,
            ...metadata
          }
        })
      } else {
        // Update existing user with Agentland connection
        await supabase
          .from('users')
          .update({
            agentland_user_id: userId,
            metadata: {
              ...existingUser.metadata,
              agentlandConnected: true,
              lastSeamlessAuth: new Date().toISOString()
            }
          })
          .eq('id', existingUser.id)
      }

      // Sign in the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: `agentland_${token.substring(0, 16)}` // Temporary password
      })

      if (signInError) {
        // If sign in fails, create a magic link session
        const { error: magicLinkError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            data: {
              agentland_user_id: userId,
              source: 'agentland_seamless'
            }
          }
        })

        if (magicLinkError) throw magicLinkError
      }

      setStatus('success')
      setMessage('Erfolgreich verbunden! Sie werden weitergeleitet...')

      // Redirect to destination
      setTimeout(() => {
        router.push(`/${destination}`)
      }, 1500)

    } catch (error) {
      console.error('Seamless auth error:', error)
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Authentifizierung fehlgeschlagen')
      
      // Redirect back to Agentland after 3 seconds
      setTimeout(() => {
        window.location.href = `${process.env.NEXT_PUBLIC_AGENTLAND_URL}/teams?auth_error=true`
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Logo */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <img src="/logos/agentland-logo.png" alt="Agentland" className="h-8 w-8" />
              </div>
              <div className="text-2xl">↔️</div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            {/* Status */}
            {status === 'loading' && (
              <>
                <LoadingSpinner className="h-12 w-12 mx-auto" />
                <div>
                  <h2 className="text-xl font-semibold">Verbindung wird hergestellt</h2>
                  <p className="text-muted-foreground mt-2">
                    Ihre Agentland-Anmeldung wird übertragen...
                  </p>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <div>
                  <h2 className="text-xl font-semibold">Willkommen zur VibeCoding Bible!</h2>
                  <p className="text-muted-foreground mt-2">{message}</p>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <div>
                  <h2 className="text-xl font-semibold">Verbindung fehlgeschlagen</h2>
                  <p className="text-muted-foreground mt-2">{message}</p>
                  <p className="text-sm text-muted-foreground mt-4">
                    Sie werden zurück zu Agentland geleitet...
                  </p>
                </div>
              </>
            )}

            {/* Features Info */}
            {status === 'loading' && (
              <div className="text-left space-y-3 pt-4 border-t">
                <h3 className="font-medium text-sm">Mit der Verbindung erhalten Sie:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Zugang zu allen 10 heiligen Geboten</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Interaktive Workshops und Übungen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Nahtlose Integration mit Ihren Agentland-Projekten</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SeamlessAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <LoadingSpinner className="h-12 w-12 mx-auto" />
              <div>
                <h2 className="text-xl font-semibold">Verbindung wird hergestellt</h2>
                <p className="text-muted-foreground mt-2">
                  Ihre Agentland-Anmeldung wird übertragen...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <SeamlessAuthContent />
    </Suspense>
  )
}