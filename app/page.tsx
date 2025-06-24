'use client'

import React from 'react'
import Link from 'next/link'

// Sacred Components
const SacredHero = () => (
  <section className="min-h-screen flex items-center justify-center relative">
    {/* Sacred Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900" />
    <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-black/50" />
    
    {/* Sacred Particles */}
    <div className="absolute top-20 left-20 text-amber-400 text-4xl animate-pulse">⚡</div>
    <div className="absolute top-40 right-32 text-purple-400 text-3xl animate-bounce delay-1000">✨</div>
    <div className="absolute bottom-32 left-1/3 text-amber-400 text-5xl animate-pulse delay-2000">🔮</div>
    
    {/* Hero Content */}
    <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
      <div className="mb-8">
        <div className="text-8xl mb-6">📜</div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
        Die Vibe Coding Bibel
      </h1>
      
      <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto">
        Meistere KI-unterstützte Entwicklung mit den{' '}
        <span className="text-amber-400 font-semibold">10 heiligen Geboten</span>
        {' '}der göttlichen Programmierung
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/workshops" className="group">
          <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            ⚡ Heilige Reise beginnen
          </button>
        </Link>
        <Link href="/dashboard" className="group">
          <button className="px-8 py-4 border-2 border-amber-400 text-amber-400 font-semibold text-lg rounded-lg hover:bg-amber-400 hover:text-black transition-all duration-300">
            🏛️ Göttliches Dashboard
          </button>
        </Link>
      </div>
    </div>
  </section>
)

const SacredFeatures = () => (
  <section className="py-20 px-6">
    <div className="max-w-7xl mx-auto">
      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
          Die Heiligen Pfade
        </h2>
        <p className="text-xl text-slate-400">Drei Säulen der göttlichen Entwicklung</p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Heilige Gebote */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-purple-600/20 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300" />
          <div className="relative bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-amber-400/50 transition-all duration-300">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold mb-4 text-amber-400">Heilige Gebote</h3>
            <p className="text-slate-300 mb-6">
              Meistere die 10 göttlichen Prinzipien, die gewöhnliche Entwickler in Coding-Propheten verwandeln
            </p>
            <Link href="/workshops">
              <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-purple-600 text-white font-medium rounded-lg hover:scale-105 transition-transform duration-300">
                Gebote erkunden
              </button>
            </Link>
          </div>
        </div>

        {/* Göttliches Arsenal */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300" />
          <div className="relative bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-purple-400/50 transition-all duration-300">
            <div className="text-4xl mb-4">🛠️</div>
            <h3 className="text-2xl font-bold mb-4 text-purple-400">Göttliches Arsenal</h3>
            <p className="text-slate-300 mb-6">
              Führe die heiligen Werkzeuge: Claude, Cursor, Cline und andere mystische Entwicklungsinstrumente
            </p>
            <Link href="/workshops/ii">
              <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-lg hover:scale-105 transition-transform duration-300">
                Werkzeuge meistern
              </button>
            </Link>
          </div>
        </div>

        {/* Propheten-Gemeinschaft */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300" />
          <div className="relative bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-indigo-400/50 transition-all duration-300">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-2xl font-bold mb-4 text-indigo-400">Propheten-Gemeinschaft</h3>
            <p className="text-slate-300 mb-6">
              Tritt der Bruderschaft der Coding-Propheten bei, die Weisheit und göttliche Entwicklungspraktiken teilen
            </p>
            <Link href="/community">
              <button className="w-full py-3 border-2 border-indigo-400 text-indigo-400 font-medium rounded-lg hover:bg-indigo-400 hover:text-white transition-all duration-300">
                Den Propheten beitreten
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const SacredStats = () => (
  <section className="py-20 px-6 bg-slate-900/50">
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
        Gesegnet durch die göttlichen Zahlen
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group">
          <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
            10
          </div>
          <div className="text-slate-400 text-lg">Heilige Gebote</div>
        </div>
        <div className="group">
          <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
            ∞
          </div>
          <div className="text-slate-400 text-lg">Coding-Möglichkeiten</div>
        </div>
        <div className="group">
          <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
            1
          </div>
          <div className="text-slate-400 text-lg">Göttliche Wahrheit</div>
        </div>
      </div>
    </div>
  </section>
)

const SacredCTA = () => (
  <section className="py-20 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-amber-400 to-purple-400 bg-clip-text text-transparent">
        Bereit zum Aufstieg zur göttlichen Entwicklung?
      </h2>
      <p className="text-xl text-slate-300 mb-10 leading-relaxed">
        Verwandle deine Coding-Praxis mit heiliger Weisheit, die Tausende von Entwicklern 
        von bloßen Sterblichen zu digitalen Propheten geführt hat. Der Pfad zur Erleuchtung wartet.
      </p>
      
      <Link href="/workshops">
        <button className="px-12 py-5 bg-gradient-to-r from-amber-500 via-purple-600 to-amber-500 text-white font-bold text-xl rounded-lg shadow-2xl hover:shadow-amber-500/25 transform hover:scale-105 transition-all duration-300 animate-pulse">
          <span className="flex items-center gap-4">
            <span className="text-3xl">⚡</span>
            <span>Die heilige Reise beginnen</span>
            <span className="text-3xl">⚡</span>
          </span>
        </button>
      </Link>
    </div>
  </section>
)

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <SacredHero />
      <SacredFeatures />
      <SacredStats />
      <SacredCTA />
    </main>
  )
}