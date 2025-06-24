'use client'

import { useEffect } from 'react'
import { ReferralTracker } from '@/lib/referral-tracking'

export function ReferralTrackingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize referral tracking when the app loads
    ReferralTracker.initialize()
    
    // Optional: Log if user has an active referral
    if (ReferralTracker.hasActiveReferral()) {
      const code = ReferralTracker.getActiveReferralCode()
      console.log(`👥 Active referral code: ${code}`)
    }
  }, [])

  return <>{children}</>
}