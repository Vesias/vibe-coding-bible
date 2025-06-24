'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from '@/hooks/use-toast'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

function SignInPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const message = searchParams.get('message')
  const error = searchParams.get('error')

  useEffect(() => {
    // Redirect if already authenticated
    if (!authLoading && user) {
      const redirectTo = searchParams.get('redirectTo') || '/dashboard'
      router.push(redirectTo)
    }
  }, [user, authLoading, router, searchParams])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) throw error

      toast({
        title: "🎉 Willkommen zurück!",
        description: "Du hast dich erfolgreich in deine göttliche Coding-Reise eingeloggt."
      })

      const redirectTo = searchParams.get('redirectTo') || '/dashboard'
      router.push(redirectTo)
    } catch (error: any) {
      let errorMessage = error.message
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Ungültige Anmeldedaten. Bitte überprüfe E-Mail und Passwort.'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Bitte bestätige deine E-Mail-Adresse, bevor du dich anmeldest.'
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Zu viele Anmeldeversuche. Bitte warte einen Moment.'
      }
      
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email) {
      toast({
        title: "E-Mail erforderlich",
        description: "Bitte gib deine E-Mail-Adresse ein.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      toast({
        title: "📧 Passwort-Reset gesendet",
        description: "Wir haben dir eine E-Mail zum Zurücksetzen deines Passworts gesendet."
      })
      
      setShowForgotPassword(false)
    } catch (error: any) {
      toast({
        title: "Fehler beim Passwort-Reset",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSocialAuth = async (provider: 'google' | 'github' | 'discord') => {
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Social Login fehlgeschlagen",
        description: error.message,
        variant: "destructive"
      })
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-white">
          Willkommen zurück, Seeker
        </CardTitle>
        <CardDescription className="text-purple-200">
          Setze deine göttliche Coding-Reise fort
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status Messages */}
        {message === 'check-email' && (
          <Alert className="bg-blue-900/20 border-blue-500/20">
            <AlertDescription className="text-blue-200">
              📧 Bitte überprüfe deine E-Mails und klicke auf den Bestätigungslink, um dein Konto zu aktivieren.
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert className="bg-red-900/20 border-red-500/20">
            <AlertDescription className="text-red-200">
              ❌ {error === 'access_denied' ? 'Zugriff verweigert. Bitte versuche es erneut.' : 'Ein Fehler ist aufgetreten.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Social Authentication */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialAuth('google')}
            disabled={loading}
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Mit Google anmelden
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialAuth('github')}
            disabled={loading}
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Mit GitHub anmelden
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black/40 px-2 text-purple-200">
              Oder mit E-Mail
            </span>
          </div>
        </div>

        {/* Sign In Form */}
        {!showForgotPassword ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                E-Mail-Adresse
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="deine@email.de"
                required
                disabled={loading}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Passwort
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Dein göttliches Passwort"
                required
                disabled={loading}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-purple-300 hover:text-purple-100 underline"
                disabled={loading}
              >
                Passwort vergessen?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
              disabled={loading}
            >
              {loading && <LoadingSpinner size="sm" className="mr-2" />}
              🔮 Anmelden
            </Button>
          </form>
        ) : (
          /* Forgot Password Form */
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium text-white mb-2">
                Passwort zurücksetzen
              </h3>
              <p className="text-sm text-purple-200">
                Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen deines Passworts.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resetEmail" className="text-white">
                E-Mail-Adresse
              </Label>
              <Input
                id="resetEmail"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="deine@email.de"
                required
                disabled={loading}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForgotPassword(false)}
                disabled={loading}
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Zurück
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
                disabled={loading}
              >
                {loading && <LoadingSpinner size="sm" className="mr-2" />}
                📧 Link senden
              </Button>
            </div>
          </form>
        )}

        <div className="text-center">
          <p className="text-sm text-purple-200">
            Noch kein Teil der Gemeinschaft?{' '}
            <Link 
              href="/auth/signup" 
              className="text-purple-300 hover:text-purple-100 underline font-medium"
            >
              Jetzt registrieren
            </Link>
          </p>
        </div>

        {/* Benefits Highlight */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-white flex items-center">
              ⚡ Nach der Anmeldung verfügbar
            </h4>
            <Badge variant="outline" className="border-purple-400/50 text-purple-300">
              Exklusiv
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-purple-200">
            <div className="flex items-center">
              <span className="mr-1">🎯</span>
              Personalisiertes Dashboard
            </div>
            <div className="flex items-center">
              <span className="mr-1">🤖</span>
              KI-Mentor Zugang
            </div>
            <div className="flex items-center">
              <span className="mr-1">📚</span>
              Alle 10 Gebote
            </div>
            <div className="flex items-center">
              <span className="mr-1">🏆</span>
              Fortschrittsverfolgung
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center text-xs text-purple-300">
          <p className="flex items-center justify-center space-x-4">
            <span className="flex items-center">
              <span className="mr-1">🔒</span>
              SSL-verschlüsselt
            </span>
            <span className="flex items-center">
              <span className="mr-1">🛡️</span>
              DSGVO-konform
            </span>
            <span className="flex items-center">
              <span className="mr-1">⚡</span>
              Sofortiger Zugang
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <SignInPageContent />
    </Suspense>
  )
}