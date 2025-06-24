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
import { Alert, AlertDescription } from '@/components/ui/alert'

function ResetPasswordPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  })
  const { toast } = useToast()
  const supabase = createClient()

  // Check if we have the necessary tokens from the URL
  const accessToken = searchParams.get('access_token')
  const refreshToken = searchParams.get('refresh_token')
  const type = searchParams.get('type')

  useEffect(() => {
    // If we have tokens, set the session
    if (accessToken && refreshToken && type === 'recovery') {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })
    }
  }, [accessToken, refreshToken, type])

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

    return true
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      })

      if (error) throw error

      toast({
        title: "🎉 Passwort erfolgreich zurückgesetzt!",
        description: "Dein Passwort wurde erfolgreich geändert. Du kannst dich jetzt mit deinem neuen Passwort anmelden."
      })

      // Redirect to sign in page
      router.push('/auth/signin?message=password-reset-success')
    } catch (error: any) {
      let errorMessage = error.message
      
      if (error.message.includes('same_password')) {
        errorMessage = 'Das neue Passwort muss sich von deinem aktuellen Passwort unterscheiden.'
      } else if (error.message.includes('weak_password')) {
        errorMessage = 'Das Passwort ist zu schwach. Verwende mindestens 8 Zeichen mit Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen.'
      }
      
      toast({
        title: "Fehler beim Zurücksetzen",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // If no tokens, show error
  if (!accessToken || !refreshToken || type !== 'recovery') {
    return (
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-white">
            Ungültiger Link
          </CardTitle>
          <CardDescription className="text-purple-200">
            Der Link zum Zurücksetzen des Passworts ist ungültig oder abgelaufen
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="bg-red-900/20 border-red-500/20">
            <AlertDescription className="text-red-200">
              ❌ Dieser Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Link zum Zurücksetzen deines Passworts an.
            </AlertDescription>
          </Alert>

          <div className="text-center">
            <Link 
              href="/auth/signin" 
              className="text-purple-300 hover:text-purple-100 underline font-medium"
            >
              Zurück zur Anmeldung
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-white">
          Neues Passwort setzen
        </CardTitle>
        <CardDescription className="text-purple-200">
          Wähle ein starkes, neues Passwort für dein Konto
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Alert className="bg-blue-900/20 border-blue-500/20">
          <AlertDescription className="text-blue-200">
            🔒 Wähle ein sicheres Passwort mit mindestens 8 Zeichen, das Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen enthält.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Neues Passwort *
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
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-300">
                Passwörter stimmen nicht überein
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
            disabled={loading || passwordStrength.score < 3}
          >
            {loading && <LoadingSpinner size="sm" className="mr-2" />}
            🔐 Passwort zurücksetzen
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-purple-200">
            Erinnerst du dich an dein Passwort?{' '}
            <Link 
              href="/auth/signin" 
              className="text-purple-300 hover:text-purple-100 underline font-medium"
            >
              Zurück zur Anmeldung
            </Link>
          </p>
        </div>

        {/* Security Tips */}
        <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
          <h4 className="font-medium text-white mb-2 flex items-center">
            🛡️ Sicherheitstipps
          </h4>
          <ul className="text-sm text-purple-200 space-y-1">
            <li>• Mindestens 8 Zeichen lang</li>
            <li>• Kombination aus Groß- und Kleinbuchstaben</li>
            <li>• Zahlen und Sonderzeichen verwenden</li>
            <li>• Kein Passwort mehrfach verwenden</li>
            <li>• Regelmäßig Passwörter ändern</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <ResetPasswordPageContent />
    </Suspense>
  )
}