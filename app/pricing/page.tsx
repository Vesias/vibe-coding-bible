import { Metadata } from 'next'
import { EnhancedPricingSection } from '@/components/pricing/EnhancedPricingSection'

export const metadata: Metadata = {
  title: 'Preise - Vibe Coding Bible',
  description: 'Wähle den perfekten Plan für deine Coding-Reise. Von kostenlosen Grundlagen bis hin zu lebenslangem Zugang mit 15% Referral-Provision.',
  keywords: 'Vibe Coding Bible Preise, Coding Kurse, AI Entwicklung, Programmierung lernen',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <EnhancedPricingSection />
    </div>
  )
}