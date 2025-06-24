'use client'

import { AuthProvider } from '@/lib/auth/AuthProvider'
import { ProgressProvider } from '@/lib/progress/ProgressProvider'
import { ThemeProvider } from './ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import { FloatingParticles } from '@/components/effects/FloatingParticles'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <ProgressProvider>
          <FloatingParticles />
          {children}
          <Toaster />
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}