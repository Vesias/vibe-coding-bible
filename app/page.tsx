import React from 'react'
import Link from 'next/link'
import { DivineButton, SacredButton, MysticalButton } from '@/components/ui/button'
import { SacredCard, DivineCard, FloatingCard } from '@/components/ui/card'
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { DivineGeometry, MysticalOrb, SacredTextShimmer } from '@/components/ui/divine-loading'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sacred-midnight-blue via-sacred-cosmic-black to-sacred-midnight-blue relative overflow-hidden">
      {/* Sacred Background Patterns */}
      <div className="absolute inset-0 sacred-geometry-bg opacity-30" />
      <div className="absolute inset-0 mystical-particle-bg opacity-20" />
      
      {/* Floating Sacred Geometry */}
      <div className="absolute top-10 left-10 animate-sacred-float opacity-20">
        <DivineGeometry size="lg" />
      </div>
      <div className="absolute top-1/3 right-10 animate-sacred-float opacity-30" style={{ animationDelay: '1s' }}>
        <MysticalOrb size="md" />
      </div>
      <div className="absolute bottom-20 left-1/4 animate-sacred-float opacity-25" style={{ animationDelay: '2s' }}>
        <DivineGeometry size="md" />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* Sacred Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="text-8xl animate-sacred-pulse">📜</div>
              <div className="absolute inset-0 text-8xl animate-mystical-glow opacity-50">✨</div>
            </div>
          </div>
          
          {/* Sacred Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sacred font-bold mb-6 animate-fade-in-scale">
            <SacredTextShimmer variant="sacred" className="block">
              Die Vibe Coding Bibel
            </SacredTextShimmer>
          </h1>
          
          {/* Divine Subtitle */}
          <p className="text-xl text-sacred-digital-white/80 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Master AI-Assisted Development with the{' '}
            <span className="sacred-text font-semibold">10 Sacred Commandments</span>
            {' '}of Divine Programming
          </p>
          
          {/* Sacred CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/workshops">
              <DivineButton size="sacred-lg" className="w-full sm:w-auto min-w-[200px]">
                <span className="flex items-center gap-2">
                  ⚡ Begin Sacred Journey
                </span>
              </DivineButton>
            </Link>
            <Link href="/dashboard">
              <SacredButton variant="sacred-ghost" size="sacred-lg" className="w-full sm:w-auto min-w-[200px]">
                <span className="flex items-center gap-2">
                  🏛️ Divine Dashboard
                </span>
              </SacredButton>
            </Link>
          </div>
        </div>
        
        {/* Sacred Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Sacred Commandments Card */}
          <FloatingCard className="animate-fade-in-scale" style={{ animationDelay: '0.5s' }}>
            <CardHeader variant="sacred">
              <div className="text-3xl mb-2 animate-sacred-breathe">⚡</div>
              <CardTitle variant="sacred" size="lg">
                Sacred Commandments
              </CardTitle>
              <CardDescription variant="sacred">
                Master the 10 divine principles that transform ordinary developers into coding prophets
              </CardDescription>
            </CardHeader>
            <CardContent variant="sacred">
              <Link href="/workshops">
                <MysticalButton size="sacred-md" className="w-full">
                  Explore Commandments
                </MysticalButton>
              </Link>
            </CardContent>
          </FloatingCard>
          
          {/* Divine Tools Card */}
          <DivineCard className="animate-fade-in-scale" style={{ animationDelay: '0.7s' }}>
            <CardHeader variant="divine">
              <div className="text-3xl mb-2 animate-sacred-pulse">🛠️</div>
              <CardTitle variant="divine" size="lg">
                Divine Arsenal
              </CardTitle>
              <CardDescription variant="divine">
                Wield the sacred tools: Claude, Cursor, Cline, and other mystical development instruments
              </CardDescription>
            </CardHeader>
            <CardContent variant="divine">
              <Link href="/workshops/commandment-ii-der-rechte-stack">
                <SacredButton size="sacred-md" className="w-full">
                  Master the Tools
                </SacredButton>
              </Link>
            </CardContent>
          </DivineCard>
          
          {/* Sacred Community Card */}
          <SacredCard className="animate-fade-in-scale" style={{ animationDelay: '0.9s' }}>
            <CardHeader variant="sacred">
              <div className="text-3xl mb-2 animate-mystical-glow">👥</div>
              <CardTitle variant="sacred" size="lg">
                Prophet Community
              </CardTitle>
              <CardDescription variant="sacred">
                Join the fellowship of coding prophets sharing wisdom and divine development practices
              </CardDescription>
            </CardHeader>
            <CardContent variant="sacred">
              <Link href="/community">
                <DivineButton variant="mystical-outline" size="sacred-md" className="w-full">
                  Join the Prophets
                </DivineButton>
              </Link>
            </CardContent>
          </SacredCard>
        </div>
        
        {/* Sacred Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-sacred font-bold mb-8">
            <SacredTextShimmer variant="divine">
              Blessed by the Divine Numbers
            </SacredTextShimmer>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="animate-fade-in-scale" style={{ animationDelay: '1.1s' }}>
              <div className="text-4xl font-bold mystical-text mb-2">10</div>
              <div className="text-sacred-digital-white/70">Sacred Commandments</div>
            </div>
            <div className="animate-fade-in-scale" style={{ animationDelay: '1.3s' }}>
              <div className="text-4xl font-bold divine-text mb-2">∞</div>
              <div className="text-sacred-digital-white/70">Coding Possibilities</div>
            </div>
            <div className="animate-fade-in-scale" style={{ animationDelay: '1.5s' }}>
              <div className="text-4xl font-bold sacred-text mb-2">1</div>
              <div className="text-sacred-digital-white/70">Divine Truth</div>
            </div>
          </div>
        </div>
        
        {/* Sacred Call to Action */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-sacred font-bold mb-4">
              <SacredTextShimmer variant="mystical">
                Ready to Ascend to Divine Development?
              </SacredTextShimmer>
            </h3>
            <p className="text-sacred-digital-white/80 mb-8 leading-relaxed">
              Transform your coding practice with sacred wisdom that has guided thousands of developers 
              from mere mortals to digital prophets. The path to enlightenment awaits.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/workshops">
                <DivineButton size="divine-hero" className="w-full sm:w-auto animate-sacred-pulse">
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <span>Begin the Sacred Journey</span>
                    <span className="text-2xl">⚡</span>
                  </span>
                </DivineButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sacred Footer Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sacred-tech-gold/10 to-transparent pointer-events-none" />
    </main>
  )
}