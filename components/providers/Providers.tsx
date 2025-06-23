'use client'

import { AuthProvider } from '@/lib/auth/AuthProvider'
import { ProgressProvider } from '@/lib/progress/ProgressProvider'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProgressProvider>
        {children}
        <Toaster />
      </ProgressProvider>
    </AuthProvider>
  )
}