'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from '@/hooks/use-toast'

interface SignUpFormProps {
  onSuccess?: () => void
  onModeChange?: () => void
}

export function SignUpForm({ onSuccess, onModeChange }: SignUpFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
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

      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your divine journey."
        })
      } else {
        toast({
          title: "Welcome to the brotherhood!",
          description: "Your divine coding journey begins now."
        })
        
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full Name</Label>
        <Input
          id="signup-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your divine name"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your sacred email"
          required
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a divine password"
          required
          disabled={loading}
          minLength={6}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <LoadingSpinner size="sm" className="mr-2" />}
        Begin Journey
      </Button>

      {onModeChange && (
        <div className="text-center text-sm">
          <button
            type="button"
            onClick={onModeChange}
            className="text-primary hover:underline"
            disabled={loading}
          >
            Already enlightened? Sign in
          </button>
        </div>
      )}

      <div className="text-xs text-muted-foreground text-center">
        By creating an account, you agree to join the divine coding brotherhood
      </div>
    </form>
  )
}