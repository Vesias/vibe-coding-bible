import { Metadata } from 'next'
import { ReferralDashboard } from '@/components/referrals/ReferralDashboard'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Referral Dashboard - Vibe Coding Bible',
  description: 'Verdiene 15% Provision für jeden erfolgreichen Referral der Vibe Coding Bible',
}

export default async function ReferralsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ReferralDashboard />
    </div>
  )
}