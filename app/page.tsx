import { HeroSection } from '@/components/landing/HeroSection'
import { CommandmentsPreview } from '@/components/landing/CommandmentsPreview'
import { PricingSection } from '@/components/landing/PricingSection'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900">
      {/* Temporary Hero Section */}
      <div className="relative">
        <HeroSection />
      </div>

      {/* Commandments Preview */}
      <div className="py-20">
        <CommandmentsPreview />
      </div>

      {/* Pricing Section */}
      <div className="py-20">
        <PricingSection />
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">🔮 Die Vibe Coding Bibel</h3>
          <p className="text-slate-300 mb-4">Master AI-Assisted Development with the 10 Sacred Commandments</p>
          <p className="text-sm text-slate-400">© 2025 vibecodingbible.agentland.saarland - All rights reserved</p>
        </div>
      </footer>
    </main>
  )
}