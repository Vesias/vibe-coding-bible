'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Auth Components
import { SignInForm } from './forms/SignInForm'
import { SignUpForm } from './forms/SignUpForm'
import { SocialAuthButtons } from './forms/SocialAuthButtons'
import { OnboardingFlow } from './onboarding/OnboardingFlow'

interface AuthContainerProps {
  initialMode?: 'signin' | 'signup'
  onSuccess?: () => void
}

export function AuthContainer({ initialMode = 'signin', onSuccess }: AuthContainerProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'onboarding'>(initialMode)

  const handleModeChange = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
  }

  const handleSignUpSuccess = () => {
    setMode('onboarding')
  }

  if (mode === 'onboarding') {
    return <OnboardingFlow />
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
          <span className="text-2xl">🔮</span>
        </div>
        <CardTitle className="text-2xl font-bold">
          {mode === 'signin' ? 'Welcome Back, Seeker' : 'Begin Your Divine Journey'}
        </CardTitle>
        <CardDescription>
          {mode === 'signin' 
            ? 'Continue your path to coding enlightenment' 
            : 'Join the sacred brotherhood of divine coders'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Social Authentication */}
        <SocialAuthButtons onSuccess={onSuccess} />
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        {mode === 'signin' ? (
          <SignInForm 
            onSuccess={onSuccess}
            onModeChange={handleModeChange}
          />
        ) : (
          <SignUpForm 
            onSuccess={handleSignUpSuccess}
            onModeChange={handleModeChange}
          />
        )}
      </CardContent>
    </Card>
  )
}