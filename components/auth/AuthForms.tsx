'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onModeChange: (mode: 'signin' | 'signup') => void
}

export function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'auth' | 'onboarding'>('auth')
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error

        toast({
          title: "Welcome back!",
          description: "You've successfully signed in to your divine coding journey."
        })

        router.push('/dashboard')
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        })

        if (error) throw error

        if (data.user && !data.session) {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link to complete your registration."
          })
        } else if (data.session) {
          // Auto sign-in successful, proceed to onboarding
          setStep('onboarding')
        }
      }
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
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      setLoading(false)
    }
  }

  if (step === 'onboarding') {
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
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialAuth('google')}
            disabled={loading}
            className="w-full"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialAuth('github')}
            disabled={loading}
            className="w-full"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialAuth('discord')}
            disabled={loading}
            className="w-full"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
            </svg>
            Continue with Discord
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your divine name"
                required
                disabled={loading}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your sacred email"
              required
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your divine password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <LoadingSpinner size="sm" className="mr-2" />}
            {mode === 'signin' ? 'Sign In' : 'Begin Journey'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
            className="text-primary hover:underline"
            disabled={loading}
          >
            {mode === 'signin' 
              ? "New seeker? Begin your journey" 
              : "Already enlightened? Sign in"
            }
          </button>
        </div>

        {mode === 'signup' && (
          <div className="text-xs text-muted-foreground text-center">
            By creating an account, you agree to join the divine coding brotherhood
            and follow the sacred commandments of ethical development.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState({
    experienceLevel: '',
    interests: [] as string[],
    goals: [] as string[],
    learningStyle: '',
    preferredLanguages: [] as string[],
    timezone: '',
    githubUsername: '',
    discordUsername: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const steps = [
    {
      title: "Tell us about your coding experience",
      description: "Help us personalize your divine journey"
    },
    {
      title: "What interests you most?",
      description: "Choose your sacred coding domains"
    },
    {
      title: "Set your divine goals",
      description: "What do you seek to achieve?"
    },
    {
      title: "Complete your profile",
      description: "Connect with the coding brotherhood"
    }
  ]

  const experienceLevels = [
    { value: 'beginner', label: 'Novice Seeker', description: 'Just starting the journey', icon: '🌱' },
    { value: 'intermediate', label: 'Apprentice Coder', description: 'Some divine knowledge gained', icon: '📚' },
    { value: 'advanced', label: 'Code Practitioner', description: 'Wielding the sacred tools', icon: '⚡' },
    { value: 'expert', label: 'Code Prophet', description: 'Spreading the divine wisdom', icon: '🔮' }
  ]

  const interests = [
    'Web Development', 'Mobile Apps', 'AI/Machine Learning', 'Data Science',
    'DevOps', 'Game Development', 'Blockchain', 'Cloud Computing',
    'Cybersecurity', 'UI/UX Design', 'Backend Systems', 'Frontend Frameworks'
  ]

  const goals = [
    'Learn new technologies', 'Build portfolio projects', 'Get certified',
    'Find mentorship', 'Join coding communities', 'Start a tech career',
    'Improve existing skills', 'Contribute to open source', 'Launch a startup',
    'Become a mentor', 'Learn best practices', 'Master algorithms'
  ]

  const learningStyles = [
    { value: 'visual', label: 'Visual Learner', description: 'Learn through diagrams and examples', icon: '👁️' },
    { value: 'hands-on', label: 'Hands-on Practitioner', description: 'Learn by doing and building', icon: '🛠️' },
    { value: 'collaborative', label: 'Collaborative Seeker', description: 'Learn through discussion and teamwork', icon: '🤝' },
    { value: 'structured', label: 'Structured Scholar', description: 'Follow systematic learning paths', icon: '📋' }
  ]

  const languages = [
    'JavaScript', 'Python', 'TypeScript', 'Java', 'C++', 'C#',
    'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin'
  ]

  const handleStepSubmit = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      await completeOnboarding()
    }
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

  const toggleArrayItem = (array: string[], item: string, setter: (value: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item))
    } else {
      setter([...array, item])
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  index <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <Badge variant="outline">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
        
        <CardTitle>{steps[currentStep].title}</CardTitle>
        <CardDescription>{steps[currentStep].description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentStep === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experienceLevels.map((level) => (
              <Card
                key={level.value}
                className={`cursor-pointer transition-all ${
                  profile.experienceLevel === level.value
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setProfile(prev => ({ ...prev, experienceLevel: level.value }))}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{level.icon}</div>
                  <h3 className="font-semibold">{level.label}</h3>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interests.map((interest) => (
                <Button
                  key={interest}
                  variant={profile.interests.includes(interest) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayItem(
                    profile.interests,
                    interest,
                    (newInterests) => setProfile(prev => ({ ...prev, interests: newInterests }))
                  )}
                >
                  {interest}
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Select all that apply. You can change these later.
            </p>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goals.map((goal) => (
                <Button
                  key={goal}
                  variant={profile.goals.includes(goal) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayItem(
                    profile.goals,
                    goal,
                    (newGoals) => setProfile(prev => ({ ...prev, goals: newGoals }))
                  )}
                  className="justify-start"
                >
                  {goal}
                </Button>
              ))}
            </div>
            
            <div className="space-y-4 mt-6">
              <Label>How do you prefer to learn?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningStyles.map((style) => (
                  <Card
                    key={style.value}
                    className={`cursor-pointer transition-all ${
                      profile.learningStyle === style.value
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setProfile(prev => ({ ...prev, learningStyle: style.value }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{style.icon}</span>
                        <div>
                          <h4 className="font-medium">{style.label}</h4>
                          <p className="text-sm text-muted-foreground">{style.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Preferred programming languages (optional)</Label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang}
                    variant={profile.preferredLanguages.includes(lang) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleArrayItem(
                      profile.preferredLanguages,
                      lang,
                      (newLangs) => setProfile(prev => ({ ...prev, preferredLanguages: newLangs }))
                    )}
                  >
                    {lang}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone (optional)</Label>
                <Input
                  id="timezone"
                  value={profile.timezone}
                  onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                  placeholder="e.g., America/New_York"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="github">GitHub Username (optional)</Label>
                <Input
                  id="github"
                  value={profile.githubUsername}
                  onChange={(e) => setProfile(prev => ({ ...prev, githubUsername: e.target.value }))}
                  placeholder="Your GitHub username"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="discord">Discord Username (optional)</Label>
                <Input
                  id="discord"
                  value={profile.discordUsername}
                  onChange={(e) => setProfile(prev => ({ ...prev, discordUsername: e.target.value }))}
                  placeholder="Your Discord username"
                />
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">🎉 You're almost ready!</h4>
              <p className="text-sm text-muted-foreground">
                Complete your profile to join the divine coding brotherhood and start your
                personalized learning journey.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0 || loading}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleStepSubmit}
            disabled={loading || (currentStep === 0 && !profile.experienceLevel)}
          >
            {loading && <LoadingSpinner size="sm" className="mr-2" />}
            {currentStep === steps.length - 1 ? 'Complete Journey' : 'Continue'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}