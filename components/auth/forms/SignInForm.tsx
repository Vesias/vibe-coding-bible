'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from '@/hooks/use-toast'

interface SignInFormProps {
  onSuccess?: () => void
  onModeChange?: () => void
}

export function SignInForm({ onSuccess, onModeChange }: SignInFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in to your divine coding journey."
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
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
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your sacred email"
          required
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
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
        Sign In
      </Button>

      {onModeChange && (
        <div className="text-center text-sm">
          <button
            type="button"
            onClick={onModeChange}
            className="text-primary hover:underline"
            disabled={loading}
          >
            New seeker? Begin your journey
          </button>
        </div>
      )}
    </form>
  )
}