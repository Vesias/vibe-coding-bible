'use client'

import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, hsl(222 84% 7%), hsl(0 0% 7%), hsl(222 84% 7%))'
    }}>
      {/* Sacred Background Patterns */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 25% 25%, hsl(45 95% 56% / 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(258 98% 51% / 0.1) 0%, transparent 50%)',
      }} />
      
      {/* Floating Sacred Geometry */}
      <div className="absolute top-10 left-10 animate-sacred-float opacity-20 text-6xl" style={{ color: 'hsl(45 95% 56%)' }}>
        ⚡
      </div>
      <div className="absolute top-1/3 right-10 animate-sacred-float opacity-30 text-4xl" style={{ animationDelay: '1s', color: 'hsl(258 98% 51%)' }}>
        ✨
      </div>
      <div className="absolute bottom-20 left-1/4 animate-sacred-float opacity-25 text-5xl" style={{ animationDelay: '2s', color: 'hsl(45 95% 56%)' }}>
        🔮
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
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-scale" style={{
            fontFamily: 'Cinzel, serif',
            background: 'linear-gradient(135deg, hsl(45 95% 56%), hsl(258 98% 51%))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px hsl(45 95% 56% / 0.3)'
          }}>
            Die Vibe Coding Bibel
          </h1>
          
          {/* Divine Subtitle */}
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-in-right" style={{ color: 'hsl(210 33% 98% / 0.8)' }}>
            Meistere KI-unterstützte Entwicklung mit den{' '}
            <span className="font-semibold" style={{
              background: 'linear-gradient(135deg, hsl(45 95% 56%), hsl(258 98% 51%))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>10 heiligen Geboten</span>
            {' '}der göttlichen Programmierung
          </p>
          
          {/* Sacred CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
            <Link href="/workshops">
              <button className="px-8 py-4 text-white font-semibold text-lg min-w-[200px] rounded-lg transition-all duration-300" style={{
                background: 'linear-gradient(135deg, hsl(45 95% 56%), hsl(258 98% 51%))',
                boxShadow: '0 4px 12px hsl(222 84% 7% / 0.25), inset 0 1px 0 hsl(210 33% 98% / 0.2)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px hsl(222 84% 7% / 0.3), inset 0 1px 0 hsl(210 33% 98% / 0.3)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px hsl(222 84% 7% / 0.25), inset 0 1px 0 hsl(210 33% 98% / 0.2)';
              }}>
                <span className="flex items-center gap-2">
                  ⚡ Heilige Reise beginnen
                </span>
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="px-8 py-4 border-2 font-semibold text-lg min-w-[200px] rounded-lg transition-all duration-300" style={{
                borderColor: 'hsl(45 95% 56%)',
                color: 'hsl(45 95% 56%)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(45 95% 56%)';
                e.currentTarget.style.color = 'hsl(0 0% 7%)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'hsl(45 95% 56%)';
              }}>
                <span className="flex items-center gap-2">
                  🏛️ Göttliches Dashboard
                </span>
              </button>
            </Link>
          </div>
        </div>
        
        {/* Sacred Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Sacred Commandments Card */}
          <div className="p-6 animate-fade-in-scale rounded-xl backdrop-blur-md border transition-all duration-500" style={{
            animationDelay: '0.5s',
            background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.1), hsl(0 0% 100% / 0.05))',
            borderColor: 'hsl(258 98% 51% / 0.2)',
            boxShadow: '0 8px 32px hsl(222 84% 7% / 0.3), inset 0 1px 0 hsl(210 33% 98% / 0.1)'
          }}>
            <div className="text-3xl mb-4 animate-sacred-breathe">⚡</div>
            <h3 className="text-xl font-bold mb-3" style={{
              background: 'linear-gradient(135deg, hsl(45 95% 56%), hsl(258 98% 51%))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Heilige Gebote
            </h3>
            <p className="mb-4" style={{ color: 'hsl(210 33% 98% / 0.7)' }}>
              Meistere die 10 göttlichen Prinzipien, die gewöhnliche Entwickler in Coding-Propheten verwandeln
            </p>
            <Link href="/workshops">
              <button className="w-full py-3 text-white font-medium rounded-lg transition-transform duration-300" style={{
                background: 'linear-gradient(135deg, hsl(45 95% 56%), hsl(258 98% 51%))'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}>
                Gebote erkunden
              </button>
            </Link>
          </div>
          
          {/* Divine Tools Card */}
          <div className="p-6 animate-fade-in-scale rounded-xl backdrop-blur-lg border transition-all duration-500" style={{
            animationDelay: '0.7s',
            background: 'linear-gradient(135deg, hsl(222 84% 7% / 0.9), hsl(0 0% 7% / 0.8))',
            borderColor: 'hsl(45 95% 56% / 0.3)',
            boxShadow: '0 0 40px hsl(45 95% 56% / 0.1), inset 0 1px 0 hsl(45 95% 56% / 0.2)'
          }}>
            <div className="text-3xl mb-4 animate-sacred-pulse">🛠️</div>
            <h3 className="text-xl font-bold mb-3" style={{
              background: 'linear-gradient(90deg, hsl(258 98% 51%), hsl(188 94% 43%), hsl(45 95% 56%))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Göttliches Arsenal
            </h3>
            <p className="mb-4" style={{ color: 'hsl(210 33% 98% / 0.7)' }}>
              Führe die heiligen Werkzeuge: Claude, Cursor, Cline und andere mystische Entwicklungsinstrumente
            </p>
            <Link href="/workshops/commandment-ii-der-rechte-stack">
              <button className="w-full py-3 text-white font-medium rounded-lg transition-transform duration-300" style={{
                background: 'linear-gradient(135deg, hsl(258 98% 51%), hsl(188 94% 43%))'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}>
                Werkzeuge meistern
              </button>
            </Link>
          </div>
          
          {/* Sacred Community Card */}
          <div className="p-6 animate-fade-in-scale rounded-xl backdrop-blur-md border transition-all duration-500" style={{
            animationDelay: '0.9s',
            background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.1), hsl(0 0% 100% / 0.05))',
            borderColor: 'hsl(258 98% 51% / 0.2)',
            boxShadow: '0 8px 32px hsl(222 84% 7% / 0.3), inset 0 1px 0 hsl(210 33% 98% / 0.1)'
          }}>
            <div className="text-3xl mb-4 animate-mystical-glow">👥</div>
            <h3 className="text-xl font-bold mb-3" style={{
              background: 'linear-gradient(45deg, hsl(258 70% 35%), hsl(348 83% 47%), hsl(45 95% 56%))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Propheten-Gemeinschaft
            </h3>
            <p className="mb-4" style={{ color: 'hsl(210 33% 98% / 0.7)' }}>
              Tritt der Bruderschaft der Coding-Propheten bei, die Weisheit und göttliche Entwicklungspraktiken teilen
            </p>
            <Link href="/community">
              <button className="w-full py-3 border-2 font-medium rounded-lg transition-all duration-300" style={{
                borderColor: 'hsl(258 70% 35%)',
                color: 'hsl(258 70% 35%)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(258 70% 35%)';
                e.currentTarget.style.color = 'white';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'hsl(258 70% 35%)';
              }}>
                Den Propheten beitreten
              </button>
            </Link>
          </div>
        </div>
        
        {/* Sacred Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8" style={{
            fontFamily: 'Cinzel, serif',
            background: 'linear-gradient(135deg, hsl(45 95% 56%), hsl(258 98% 51%))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px hsl(45 95% 56% / 0.3)'
          }}>
            Gesegnet durch die göttlichen Zahlen
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="animate-fade-in-scale" style={{ animationDelay: '1.1s' }}>
              <div className="text-4xl font-bold mb-2" style={{
                background: 'linear-gradient(45deg, hsl(258 70% 35%), hsl(348 83% 47%), hsl(45 95% 56%))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>10</div>
              <div style={{ color: 'hsl(210 33% 98% / 0.7)' }}>Heilige Gebote</div>
            </div>
            <div className="animate-fade-in-scale" style={{ animationDelay: '1.3s' }}>
              <div className="text-4xl font-bold mb-2" style={{
                background: 'linear-gradient(90deg, hsl(258 98% 51%), hsl(188 94% 43%), hsl(45 95% 56%))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>∞</div>
              <div style={{ color: 'hsl(210 33% 98% / 0.7)' }}>Coding-Möglichkeiten</div>
            </div>
            <div className="animate-fade-in-scale" style={{ animationDelay: '1.5s' }}>
              <div className="text-4xl font-bold mb-2" style={{
                background: 'linear-gradient(135deg, hsl(45 95% 56%), hsl(258 98% 51%))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>1</div>
              <div style={{ color: 'hsl(210 33% 98% / 0.7)' }}>Göttliche Wahrheit</div>
            </div>
          </div>
        </div>
        
        {/* Sacred Call to Action */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4" style={{
              fontFamily: 'Cinzel, serif',
              background: 'linear-gradient(45deg, hsl(258 70% 35%), hsl(348 83% 47%), hsl(45 95% 56%))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Bereit zum Aufstieg zur göttlichen Entwicklung?
            </h3>
            <p className="mb-8 leading-relaxed" style={{ color: 'hsl(210 33% 98% / 0.8)' }}>
              Verwandle deine Coding-Praxis mit heiliger Weisheit, die Tausende von Entwicklern 
              von bloßen Sterblichen zu digitalen Propheten geführt hat. Der Pfad zur Erleuchtung wartet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/workshops">
                <button className="px-8 py-4 text-white font-bold text-xl animate-sacred-pulse rounded-lg transition-all duration-300" style={{
                  background: 'linear-gradient(135deg, hsl(45 95% 56%), hsl(258 98% 51%))',
                  boxShadow: '0 4px 12px hsl(222 84% 7% / 0.25), inset 0 1px 0 hsl(210 33% 98% / 0.2)'
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px hsl(222 84% 7% / 0.3), inset 0 1px 0 hsl(210 33% 98% / 0.3)';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px hsl(222 84% 7% / 0.25), inset 0 1px 0 hsl(210 33% 98% / 0.2)';
                }}>
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <span>Die heilige Reise beginnen</span>
                    <span className="text-2xl">⚡</span>
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sacred Footer Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{
        background: 'linear-gradient(to top, hsl(45 95% 56% / 0.1), transparent)'
      }} />
    </main>
  )
}