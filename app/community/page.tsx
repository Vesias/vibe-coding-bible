import React from 'react'
import Link from 'next/link'
import { SacredButton } from '@/components/ui/sacred-button'
import { EnhancedCommunityHub } from '@/components/community/EnhancedCommunityHub'

const CommunityHero = () => (
  <section className="min-h-screen flex items-center justify-center relative">
    {/* Sacred Background */}
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #581c87 100%)'
    }} />
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(45deg, rgba(0,0,0,0.5) 0%, transparent 50%, rgba(0,0,0,0.5) 100%)'
    }} />
    
    {/* Sacred Particles */}
    <div className="absolute top-20 left-20 text-4xl animate-pulse" style={{ color: '#fbbf24' }}>👥</div>
    <div className="absolute top-40 right-32 text-3xl animate-bounce" style={{ 
      color: '#c084fc',
      animationDelay: '1s'
    }}>✨</div>
    <div className="absolute bottom-32 left-1/3 text-5xl animate-pulse" style={{ 
      color: '#fbbf24',
      animationDelay: '2s'
    }}>🏛️</div>
    
    {/* Hero Content */}
    <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
      <div className="mb-8">
        <div className="text-8xl mb-6">🌟</div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{
        background: 'linear-gradient(90deg, #fbbf24 0%, #c084fc 50%, #fbbf24 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Divine Community
      </h1>
      
      <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto" style={{ color: '#cbd5e1' }}>
        Verbinde dich mit anderen{' '}
        <span className="font-semibold" style={{ color: '#fbbf24' }}>Coding-Propheten</span>
        {' '}und teile heiliges Wissen über KI-unterstützte Entwicklung
      </p>
      
      {/* Community Stats */}
      <div className="flex flex-wrap justify-center gap-8 mb-8">
        <div className="p-4 rounded-lg backdrop-blur-sm" style={{
          background: 'rgba(30, 41, 59, 0.8)'
        }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#fbbf24' }}>12,847</div>
          <div className="text-sm" style={{ color: '#94a3b8' }}>Active Prophets</div>
        </div>
        <div className="p-4 rounded-lg backdrop-blur-sm" style={{
          background: 'rgba(30, 41, 59, 0.8)'
        }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#c084fc' }}>89,234</div>
          <div className="text-sm" style={{ color: '#94a3b8' }}>Sacred Discussions</div>
        </div>
        <div className="p-4 rounded-lg backdrop-blur-sm" style={{
          background: 'rgba(30, 41, 59, 0.8)'
        }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#818cf8' }}>24/7</div>
          <div className="text-sm" style={{ color: '#94a3b8' }}>Divine Support</div>
        </div>
      </div>
    </div>
  </section>
)

const CommunityFeatures = () => (
  <section className="py-20 px-6" style={{ background: '#1e293b' }}>
    <div className="max-w-7xl mx-auto">
      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
          background: 'linear-gradient(90deg, #fbbf24 0%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Community Features
        </h2>
        <p className="text-xl" style={{ color: '#94a3b8' }}>Alles was du brauchst für dein Coding-Wachstum</p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Discord Community */}
        <div className="group relative">
          <div className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-30 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #5865f2, #738adb)', filter: 'blur(20px)' }} />
          <div className="relative p-8 rounded-xl border transition-all duration-300" style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            borderColor: '#475569'
          }}>
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#5865f2' }}>Discord Server</h3>
            <p className="mb-6" style={{ color: '#cbd5e1' }}>
              Private Discord Server mit über 10.000 aktiven Mitgliedern. 24/7 Support und Live-Hilfe.
            </p>
            <SacredButton variant="secondary" className="w-full py-3">
              Discord beitreten
            </SacredButton>
          </div>
        </div>

        {/* Mentoring */}
        <div className="group relative">
          <div className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-30 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', filter: 'blur(20px)' }} />
          <div className="relative p-8 rounded-xl border transition-all duration-300" style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            borderColor: '#475569'
          }}>
            <div className="text-4xl mb-4">🧙</div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#f59e0b' }}>1:1 Mentoring</h3>
            <p className="mb-6" style={{ color: '#cbd5e1' }}>
              Persönliche Mentoring-Sessions mit erfahrenen Entwicklern und KI-Experten.
            </p>
            <SacredButton className="w-full py-3">
              Mentor finden
            </SacredButton>
          </div>
        </div>

        {/* Code Reviews */}
        <div className="group relative">
          <div className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-30 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', filter: 'blur(20px)' }} />
          <div className="relative p-8 rounded-xl border transition-all duration-300" style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            borderColor: '#475569'
          }}>
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#10b981' }}>Code Reviews</h3>
            <p className="mb-6" style={{ color: '#cbd5e1' }}>
              Professionelle Code-Reviews von Experten. Verbessere deinen Code und lerne Best Practices.
            </p>
            <SacredButton className="w-full py-3">
              Review anfordern
            </SacredButton>
          </div>
        </div>

        {/* Live Events */}
        <div className="group relative">
          <div className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-30 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', filter: 'blur(20px)' }} />
          <div className="relative p-8 rounded-xl border transition-all duration-300" style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            borderColor: '#475569'
          }}>
            <div className="text-4xl mb-4">🎥</div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#8b5cf6' }}>Live Events</h3>
            <p className="mb-6" style={{ color: '#cbd5e1' }}>
              Wöchentliche Live-Coding Sessions, Q&A Runden und Community Challenges.
            </p>
            <SacredButton className="w-full py-3">
              Events ansehen
            </SacredButton>
          </div>
        </div>

        {/* Job Board */}
        <div className="group relative">
          <div className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-30 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', filter: 'blur(20px)' }} />
          <div className="relative p-8 rounded-xl border transition-all duration-300" style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            borderColor: '#475569'
          }}>
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#ef4444' }}>Job Board</h3>
            <p className="mb-6" style={{ color: '#cbd5e1' }}>
              Exklusive Job-Angebote für Community-Mitglieder von Top-Tech-Unternehmen.
            </p>
            <SacredButton className="w-full py-3">
              Jobs finden
            </SacredButton>
          </div>
        </div>

        {/* Showcases */}
        <div className="group relative">
          <div className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-30 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', filter: 'blur(20px)' }} />
          <div className="relative p-8 rounded-xl border transition-all duration-300" style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            borderColor: '#475569'
          }}>
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#06b6d4' }}>Project Showcase</h3>
            <p className="mb-6" style={{ color: '#cbd5e1' }}>
              Teile deine Projekte mit der Community und erhalte wertvolles Feedback.
            </p>
            <SacredButton className="w-full py-3">
              Projekt teilen
            </SacredButton>
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <EnhancedCommunityHub />
      </div>
    </main>
  )
}