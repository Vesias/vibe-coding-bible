'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'

// Onboarding Steps
import { ExperienceStep } from './steps/ExperienceStep'
import { InterestsStep } from './steps/InterestsStep'
import { GoalsStep } from './steps/GoalsStep'
import { LearningStyleStep } from './steps/LearningStyleStep'
import { PersonalInfoStep } from './steps/PersonalInfoStep'

interface OnboardingProfile {
  experienceLevel: string
  interests: string[]
  goals: string[]
  learningStyle: string
  preferredLanguages: string[]
  githubUsername: string
  discordUsername: string
  timezone: string
}

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<OnboardingProfile>({
    experienceLevel: '',
    interests: [],
    goals: [],
    learningStyle: '',
    preferredLanguages: [],
    githubUsername: '',
    discordUsername: '',
    timezone: ''
  })

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const steps = [
    {
      title: 'Experience Level',
      description: 'Tell us about your coding journey',
      component: ExperienceStep
    },
    {
      title: 'Interests & Technologies',
      description: 'What excites you in the tech world?',
      component: InterestsStep
    },
    {
      title: 'Learning Goals',
      description: 'What do you want to achieve?',
      component: GoalsStep
    },
    {
      title: 'Learning Style',
      description: 'How do you learn best?',
      component: LearningStyleStep
    },
    {
      title: 'Personal Info',
      description: 'Connect with the community',
      component: PersonalInfoStep
    }
  ]

  const currentStepData = steps[currentStep]
  const CurrentStepComponent = currentStepData.component

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateProfile = (updates: Partial<OnboardingProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const completeOnboarding = async () => {
    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('No user found')

      // Create user profile
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || '',
          subscription_status: 'free',
          prophet_rank: 'novice',
          total_xp: 0,
          current_level: 1,
          github_username: profile.githubUsername,
          discord_username: profile.discordUsername,
          timezone: profile.timezone,
          learning_preferences: {
            experienceLevel: profile.experienceLevel,
            interests: profile.interests,
            goals: profile.goals,
            learningStyle: profile.learningStyle,
            preferredLanguages: profile.preferredLanguages
          }
        })

      if (error) throw error

      toast({
        title: "Welcome to the Divine Coding Brotherhood!",
        description: "Your journey begins now. May your code be blessed with divine wisdom."
      })

      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return profile.experienceLevel !== ''
      case 1:
        return profile.interests.length > 0
      case 2:
        return profile.goals.length > 0
      case 3:
        return profile.learningStyle !== ''
      case 4:
        return true // Personal info is optional
      default:
        return false
    }
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        <Progress value={progressPercentage} className="mb-4" />
        
        <CardTitle>{currentStepData.title}</CardTitle>
        <CardDescription>{currentStepData.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <CurrentStepComponent 
          profile={profile}
          updateProfile={updateProfile}
        />
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || loading}
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepValid() || loading}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-2" />
            ) : null}
            {currentStep === steps.length - 1 ? 'Complete Journey' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}