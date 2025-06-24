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
import { Checkbox } from '@/components/ui/checkbox'

function SignUpPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  })
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    // Redirect if already authenticated
    if (!authLoading && user) {
      const redirectTo = searchParams.get('redirectTo') || '/dashboard'
      router.push(redirectTo)
    }
  }, [user, authLoading, router, searchParams])

  // Password strength checker
  useEffect(() => {
    if (formData.password) {
      const score = calculatePasswordStrength(formData.password)
      setPasswordStrength(score)
    } else {
      setPasswordStrength({ score: 0, feedback: '' })
    }
  }, [formData.password])

  const calculatePasswordStrength = (password: string) => {
    let score = 0
    let feedback = ''
    
    if (password.length >= 8) score += 1
    if (password.match(/[a-z]/)) score += 1
    if (password.match(/[A-Z]/)) score += 1
    if (password.match(/[0-9]/)) score += 1
    if (password.match(/[^a-zA-Z0-9]/)) score += 1
    
    if (score < 2) feedback = 'Schwach - Verwende mindestens 8 Zeichen'
    else if (score < 3) feedback = 'Mittelmäßig - Füge Großbuchstaben und Zahlen hinzu'
    else if (score < 4) feedback = 'Gut - Verwende Sonderzeichen für mehr Sicherheit'
    else feedback = 'Stark - Perfekt für göttliche Sicherheit!'
    
    return { score, feedback }
  }

  const getPasswordStrengthColor = (score: number) => {
    if (score < 2) return 'bg-red-500'
    if (score < 3) return 'bg-yellow-500'
    if (score < 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast({
        title: "Ungültiger Name",
        description: "Bitte gib deinen heiligen Namen ein.",
        variant: "destructive"
      })
      return false
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Ungültige E-Mail",
        description: "Bitte gib eine gültige E-Mail-Adresse ein.",
        variant: "destructive"
      })
      return false
    }

    if (formData.password.length < 8) {
      toast({
        title: "Passwort zu schwach",
        description: "Das Passwort muss mindestens 8 Zeichen lang sein.",
        variant: "destructive"
      })
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwörter stimmen nicht überein",
        description: "Bitte überprüfe deine Passworteingabe.",
        variant: "destructive"
      })
      return false
    }

    if (!acceptTerms) {
      toast({
        title: "Bedingungen akzeptieren",
        description: "Du musst die heiligen Gebote akzeptieren, um fortzufahren.",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          }
        }
      })

      if (error) throw error

      if (data.user && !data.session) {
        toast({
          title: "🎉 Willkommen im heiligen Kreis!",
          description: "Wir haben dir eine Bestätigungs-E-Mail gesendet. Prüfe deinen Posteingang, um deine göttliche Reise zu beginnen."
        })
        
        // Redirect to a confirmation page or signin
        router.push('/auth/signin?message=check-email')
      } else if (data.session) {
        toast({
          title: "🎉 Willkommen in der göttlichen Gemeinschaft!",
          description: "Deine Reise zu göttlicher Programmierung beginnt jetzt."
        })
        
        router.push('/dashboard')
      }
    } catch (error: any) {
      let errorMessage = error.message
      
      if (error.message.includes('already registered')) {
        errorMessage = 'Diese E-Mail ist bereits registriert. Versuche dich anzumelden.'
      } else if (error.message.includes('invalid email')) {
        errorMessage = 'Bitte gib eine gültige E-Mail-Adresse ein.'
      } else if (error.message.includes('password')) {
        errorMessage = 'Das Passwort entspricht nicht den Sicherheitsanforderungen.'
      }
      
      toast({
        title: "Registrierung fehlgeschlagen",
        description: errorMessage,
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
          Werde Teil der heiligen Gemeinschaft
        </CardTitle>
        <CardDescription className="text-purple-200">
          Beginne deine Reise zu göttlicher Programmierung
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
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
            Mit Google registrieren
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
            Mit GitHub registrieren
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

        {/* Registration Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white">
              Vollständiger Name *
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Dein heiliger Name"
              required
              disabled={loading}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              E-Mail-Adresse *
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
              Passwort *
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Mindestens 8 Zeichen"
              required
              disabled={loading}
              minLength={8}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            {formData.password && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getPasswordStrengthColor(passwordStrength.score)}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-purple-200">
                    {passwordStrength.score}/5
                  </span>
                </div>
                <p className="text-xs text-purple-200">
                  {passwordStrength.feedback}
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Passwort bestätigen *
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Passwort wiederholen"
              required
              disabled={loading}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
            />
            <Label htmlFor="terms" className="text-sm text-purple-200 leading-relaxed">
              Ich akzeptiere die{' '}
              <Link 
                href="/terms" 
                className="text-purple-300 hover:text-purple-100 underline"
                target="_blank"
              >
                heiligen Gebote
              </Link>
              {' '}und die{' '}
              <Link 
                href="/privacy" 
                className="text-purple-300 hover:text-purple-100 underline"
                target="_blank"
              >
                Datenschutzbestimmungen
              </Link>
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
            disabled={loading}
          >
            {loading && <LoadingSpinner size="sm" className="mr-2" />}
            🎉 Heilige Reise beginnen
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-purple-200">
            Bereits Teil der Gemeinschaft?{' '}
            <Link 
              href="/auth/signin" 
              className="text-purple-300 hover:text-purple-100 underline font-medium"
            >
              Hier anmelden
            </Link>
          </p>
        </div>

        <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
          <h4 className="font-medium text-white mb-2 flex items-center">
            ✨ Warum der Gemeinschaft beitreten?
          </h4>
          <ul className="text-sm text-purple-200 space-y-1">
            <li>• Zugang zu den 10 heiligen Geboten der Programmierung</li>
            <li>• Personalisierte KI-Mentoring und Feedback</li>
            <li>• Exklusive Workshops und Masterclasses</li>
            <li>• Gemeinschaft von gleichgesinnten Entwicklern</li>
            <li>• Fortschrittsverfolgung und Zertifizierungen</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <SignUpPageContent />
    </Suspense>
  )
}