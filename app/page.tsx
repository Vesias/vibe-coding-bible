'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
// import { ExportButtons } from '@/components/export/ExportButtons'
import { FAQSection, generalFAQs } from '@/components/seo/FAQSection'
import { CourseSchema } from '@/components/seo/SchemaMarkup'

// Sacred Components
const SacredHero = () => (
  <section 
    className="min-h-screen flex items-center justify-center relative agentland-gradient"
    aria-label="Hero section - Vibe Coding Bible introduction"
    role="banner"
  >
    {/* Professional Background Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-100/30 to-blue-600/10" aria-hidden="true" />
    
    {/* Professional Particles */}
    <div className="absolute top-20 left-20 text-4xl animate-pulse text-blue-600" aria-hidden="true" role="presentation">⚡</div>
    <div className="absolute top-40 right-32 text-3xl animate-bounce text-indigo-600" style={{ 
      animationDelay: '1s'
    }} aria-hidden="true" role="presentation">✨</div>
    <div className="absolute bottom-32 left-1/3 text-5xl animate-pulse text-blue-700" style={{ 
      animationDelay: '2s'
    }} aria-hidden="true" role="presentation">🔮</div>
    
    {/* Hero Content */}
    <div className="relative z-10 text-center max-w-6xl mx-auto px-6" role="main" id="main-content">
      <div className="mb-8">
        <div className="flex justify-center mb-6" aria-hidden="true" role="presentation">
          <img 
            src="/logo.png" 
            alt="Vibe Coding Bible Logo" 
            className="w-32 h-32 object-contain filter drop-shadow-2xl animate-pulse"
          />
        </div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold mb-6 agentland-text" id="main-heading">
        Die Vibe Coding Bibel
      </h1>
      
      <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-gray-700">
        Meistere KI-unterstützte Entwicklung mit den{' '}
        <span className="font-semibold text-blue-600">10 AgentLand Geboten</span>
        {' '}der professionellen Programmierung
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center" role="group" aria-label="Main navigation actions">
        <Link href="/workshops" className="group">
          <button 
            className="px-8 py-4 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-describedby="workshops-description"
          >
            <span aria-hidden="true">⚡</span> AgentLand Reise beginnen
          </button>
          <div id="workshops-description" className="sr-only">Starte deine Lernreise mit interaktiven Workshops</div>
        </Link>
        <Link href="/dashboard" className="group">
          <Button 
            variant="outline" 
            size="lg"
            aria-describedby="dashboard-description"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            <span aria-hidden="true">🏛️</span> AgentLand Dashboard
          </Button>
          <div id="dashboard-description" className="sr-only">Zugang zu deinem persönlichen Lern-Dashboard</div>
        </Link>
      </div>
    </div>
  </section>
)

const SacredFeatures = () => (
  <section className="py-20 px-6 bg-white" aria-labelledby="features-heading">
    <div className="max-w-7xl mx-auto">
      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 agentland-text" id="features-heading">
          Interaktive E-Book Workshops
        </h2>
        <p className="text-xl mb-4 text-gray-700">Live-Coding + KI-Mentoring + Praktische Projekte</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-600 border border-blue-200">
            📚 10 AgentLand Gebote
          </span>
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-600 border border-indigo-200">
            🤖 KI-Integration
          </span>
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-300">
            💰 Monetarisierung
          </span>
        </div>
      </div>

      {/* Product Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Interactive E-Books */}
        <div className="group relative">
          <div 
            className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-30 transition-all duration-300 bg-gradient-to-br from-blue-600 to-indigo-600 filter blur-xl"
          />
          <div className="relative p-8 rounded-xl border transition-all duration-300 bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-2xl font-bold mb-4 text-blue-600">Live E-Book Workshops</h3>
            <p className="mb-6 text-gray-700">
              Interaktive digitale Bücher mit eingebetteten Code-Editoren, Live-Tests und KI-Mentoring
            </p>
            <div className="mb-4">
              <span className="text-sm text-gray-600">Enthält:</span>
              <ul className="text-sm mt-2 space-y-1 text-gray-700">
                <li>• Live Code-Editoren</li>
                <li>• Instant Feedback</li>
                <li>• KI-Assistierte Hilfe</li>
              </ul>
            </div>
            <Link href="/workshops">
              <Button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white" aria-describedby="workshop-cta-desc">
                Jetzt starten - Kostenlos
              </Button>
              <div id="workshop-cta-desc" className="sr-only">Beginne deine Lernreise mit kostenlosen interaktiven Workshops</div>
            </Link>
          </div>
        </div>

        {/* Praktische Projekte */}
        <div className="group relative">
          <div 
            className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-30 transition-all duration-300 bg-gradient-to-br from-indigo-600 to-blue-700 filter blur-xl"
          />
          <div className="relative p-8 rounded-xl border transition-all duration-300 bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-4 text-indigo-600">Praktische Projekte</h3>
            <p className="mb-6 text-gray-700">
              Baue echte Anwendungen während du lernst. Von MVP bis zur Production-Ready App.
            </p>
            <div className="mb-4">
              <span className="text-sm text-gray-600">Du baust:</span>
              <ul className="text-sm mt-2 space-y-1 text-gray-700">
                <li>• SaaS Applications</li>
                <li>• KI-Tools & Bots</li>
                <li>• Profitable MVPs</li>
              </ul>
            </div>
            <Link href="/pricing">
              <Button variant="outline" className="w-full py-3 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white" aria-describedby="projects-cta-desc">
                Premium freischalten
              </Button>
              <div id="projects-cta-desc" className="sr-only">Erhalte Zugang zu allen Premium-Projekten und persönlichem Mentoring</div>
            </Link>
          </div>
        </div>

        {/* Community & Support */}
        <div className="group relative">
          <div 
            className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-30 transition-all duration-300 bg-gradient-to-br from-blue-700 to-indigo-600 filter blur-xl"
          />
          <div className="relative p-8 rounded-xl border transition-all duration-300 bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-2xl font-bold mb-4 text-blue-700">Community & Mentoring</h3>
            <p className="mb-6 text-gray-700">
              Private Discord Community + 1:1 Mentoring Sessions + Wöchentliche Live-Calls
            </p>
            <div className="mb-4">
              <span className="text-sm text-gray-600">Support:</span>
              <ul className="text-sm mt-2 space-y-1 text-gray-700">
                <li>• 24/7 Community Chat</li>
                <li>• Wöchentliche Q&A Calls</li>
                <li>• Persönliches Mentoring</li>
              </ul>
            </div>
            <Link href="/community">
              <Button variant="outline" className="w-full py-3 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white" aria-describedby="community-cta-desc">
                Community beitreten
              </Button>
              <div id="community-cta-desc" className="sr-only">Tritt unserer aktiven Entwickler-Community bei und lerne von anderen</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const SacredStats = () => (
  <section className="py-20 px-6 bg-indigo-50">
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-12 agentland-text">
        Unsere Erfolge in Zahlen
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group">
          <div className="text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 agentland-text">
            10
          </div>
          <div className="text-gray-700 text-lg">Interaktive Workshops</div>
        </div>
        <div className="group">
          <div className="text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 text-indigo-600">
            10k+
          </div>
          <div className="text-gray-700 text-lg">Aktive Lernende</div>
        </div>
        <div className="group">
          <div className="text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 text-blue-700">
            95%
          </div>
          <div className="text-gray-700 text-lg">Erfolgsrate</div>
        </div>
      </div>
    </div>
  </section>
)

const SacredTestimonials = () => (
  <section className="py-20 px-6 bg-white">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 agentland-text">
          Erfahrungsberichte
        </h2>
        <p className="text-xl text-gray-700">Was unsere Absolventen über ihre Lernerfahrung sagen</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            quote: "In nur 3 Monaten konnte ich mein Gehalt als Entwickler um 40% steigern. Die KI-Techniken haben meine Produktivität revolutioniert.",
            author: "Sarah M.",
            role: "Senior Full-Stack Developer bei Tech-Startup",
            emoji: "🚀",
            verification: "Verifiziert ✓"
          },
          {
            quote: "Das beste Investment in meine Karriere. Die interaktiven Workshops sind praxisnäher als jede Universität.",
            author: "Marcus K.",
            role: "Lead Software Architect bei Fortune 500",
            emoji: "⚡",
            verification: "Verifiziert ✓"
          },
          {
            quote: "Von Junior zu Senior Developer in 6 Monaten. Die Mentoring-Sessions haben den Unterschied gemacht.",
            author: "Lisa B.",
            role: "Senior AI Engineer bei Google",
            emoji: "🔮",
            verification: "Verifiziert ✓"
          }
        ].map((testimonial, index) => (
          <div key={index} className="group relative">
            <div className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-30 transition-all duration-300 bg-gradient-to-br from-blue-600 to-indigo-600 filter blur-xl" />
            <div className="relative p-8 rounded-xl border transition-all duration-300 bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
              <div className="text-4xl mb-4">{testimonial.emoji}</div>
              <blockquote className="text-lg mb-6 text-gray-700">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600">
                  <span className="text-xl" aria-hidden="true">{testimonial.emoji}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-blue-600">{testimonial.author}</div>
                    <span className="text-xs text-green-600 font-medium">{testimonial.verification}</span>
                  </div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const SacredExports = () => (
  <section className="py-20 px-6 bg-white">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 agentland-text">
          VibeCodingBibel™ als eBook
        </h2>
        <p className="text-xl text-gray-700">
          Lade das vollständige Kompendium in professioneller Buchqualität herunter
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-slate-400">Export functionality wird bald verfügbar sein.</p>
        </div>
      </div>
    </div>
  </section>
)

const SacredCTA = () => (
  <section className="py-20 px-6 bg-indigo-50">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 agentland-text">
        Bereit für den nächsten Karriereschritt?
      </h2>
      <p className="text-xl text-gray-700 mb-6 leading-relaxed">
        Über 10.000 Entwickler haben bereits ihre Produktivität mit KI-Tools verdoppelt. 
        Werde Teil der nächsten Generation von Software-Entwicklern.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-center">
        <p className="text-amber-800 font-medium">
          🔥 <span className="font-bold">Limitiertes Angebot:</span> Kostenloser Zugang zu allen Workshops für die ersten 1.000 Nutzer
        </p>
        <p className="text-sm text-amber-600 mt-1">Noch 247 Plätze verfügbar</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/workshops">
          <Button size="lg" className="px-12 py-5 text-xl font-bold shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" aria-describedby="main-cta-desc">
            <span className="flex items-center gap-4">
              <span className="text-3xl" aria-hidden="true">🚀</span>
              <span>Kostenlos starten</span>
              <span className="text-3xl" aria-hidden="true">🚀</span>
            </span>
          </Button>
          <div id="main-cta-desc" className="sr-only">Beginne jetzt kostenlos mit den interaktiven Workshops</div>
        </Link>
        <Link href="/pricing">
          <Button variant="outline" size="lg" className="px-12 py-5 text-xl font-bold border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" aria-describedby="pricing-cta-desc">
            <span className="flex items-center gap-4">
              <span className="text-3xl" aria-hidden="true">📊</span>
              <span>Preise ansehen</span>
            </span>
          </Button>
          <div id="pricing-cta-desc" className="sr-only">Siehe alle verfügbaren Preispläne und Premium-Features</div>
        </Link>
      </div>
    </div>
  </section>
)

export default function HomePage() {
  return (
    <>
      {/* Course Schema for the main workshops */}
      <CourseSchema
        name="Die Vibe Coding Bibel - 10 AgentLand Gebote der KI-Entwicklung"
        description="Meistere KI-unterstützte Programmierung mit interaktiven Workshops, Live-Coding und praktischen Projekten. Lerne Claude Code, GitHub Copilot und moderne Entwicklungstools."
        url="https://vibecodingbible.agentland.saarland/workshops"
        image="/og-image.jpg"
        instructor="Vibe Coding Academy"
        price={79}
        duration="P3M"
        level="Beginner to Advanced"
        prerequisites={["Grundkenntnisse in Programmierung", "Computer mit Internetverbindung"]}
        learningOutcomes={[
          "KI-unterstützte Programmierung mit Claude Code",
          "Effektive Nutzung von GitHub Copilot",
          "Moderne Web-Entwicklung mit Next.js und TypeScript",
          "SaaS-Entwicklung und Monetarisierung",
          "Agile Entwicklungsmethoden mit KI-Tools"
        ]}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <SacredHero />
        <SacredFeatures />
        <SacredStats />
        <SacredTestimonials />
        
        {/* FAQ Section for better SEO */}
        <FAQSection 
          title="Häufig gestellte Fragen"
          description="Antworten auf die wichtigsten Fragen zur Vibe Coding Bibel und unseren Workshops"
          faqs={generalFAQs}
          className="bg-gray-50"
        />
        
        <SacredExports />
        <SacredCTA />
      </main>
    </>
  )
}