'use client'

import { AuthProvider } from '@/lib/auth/AuthProvider'
import { ProgressProvider } from '@/lib/progress/ProgressProvider'
import { ThemeProvider } from './ThemeProvider'
import { PWAProvider } from './PWAProvider'
// import { ReferralTrackingProvider } from './ReferralTrackingProvider'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'
// import { FloatingParticles } from '@/components/effects/FloatingParticles'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <ProgressProvider>
          <PWAProvider>
            {/* <ReferralTrackingProvider> */}
              {/* <FloatingParticles /> */}
              {children}
              <Toaster />
              <SonnerToaster position="top-right" />
            {/* </ReferralTrackingProvider> */}
          </PWAProvider>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}