'use client'

import React from 'react'
import Link from 'next/link'

const commandments = [
  {
    number: 'I',
    title: "Die Heilige Vision",
    description: "Master product conceptualization and market validation before touching any code.",
    difficulty: "Beginner",
    xp: 150,
    readTime: 12,
    sacredSymbol: '👁️',
    preview: "Wer ohne Vision zu programmieren beginnt, ist wie ein Wanderer in der Wüste ohne Kompass..."
  },
  {
    number: 'II',
    title: "Der Rechte Stack", 
    description: "Choose the optimal technology stack for AI-assisted development.",
    difficulty: "Beginner", 
    xp: 200,
    readTime: 25,
    sacredSymbol: '🏗️',
    preview: "Das Fundament bestimmt die Höhe des Turms. Wähle weise deine Werkzeuge..."
  },
  {
    number: 'III',
    title: "Die Prompt-Kunst",
    description: "Craft perfect AI prompts that generate production-ready code.",
    difficulty: "Intermediate",
    xp: 250,
    readTime: 37,
    sacredSymbol: '🧠',
    preview: "Die Kunst der Beschwörung liegt in der Präzision der Worte..."
  },
  {
    number: 'IV',
    title: "Multi-Context Programming",
    description: "Juggle multiple projects simultaneously without losing productivity.",
    difficulty: "Advanced",
    xp: 300,
    readTime: 50,
    sacredSymbol: '🖥️',
    preview: "Wie ein Dirigent ein Orchester leitet, so führe viele Projekte..."
  },
  {
    number: 'V',
    title: "Die Heilige Iteration",
    description: "Transform MVPs into scalable products through strategic iteration.",
    difficulty: "Intermediate",
    xp: 275,
    readTime: 62,
    sacredSymbol: '🔄',
    preview: "Wie der Phönix aus der Asche steigt, so wird dein Produkt zur Vollendung gelangen..."
  },
  {
    number: 'VI',
    title: "Göttliches Debugging",
    description: "Master debugging AI-generated code with divine precision.",
    difficulty: "Advanced", 
    xp: 350,
    readTime: 75,
    sacredSymbol: '🐛',
    preview: "Der Fehlerteufel versteckt sich in den Schatten des Codes..."
  },
  {
    number: 'VII',
    title: "Die Kunst des Vertrauens",
    description: "Balance AI autonomy with human oversight for optimal results.",
    difficulty: "Advanced",
    xp: 325,
    readTime: 87,
    sacredSymbol: '🛡️',
    preview: "Vertrauen ohne Verifikation ist Naivität. Finde die Balance..."
  },
  {
    number: 'VIII',
    title: "Die Skalierungsstufen",
    description: "Scale applications from prototype to millions of users.",
    difficulty: "Expert",
    xp: 400,
    readTime: 100,
    sacredSymbol: '📈',
    preview: "Wie der Turm zu Babel soll deine Anwendung gen Himmel wachsen..."
  },
  {
    number: 'IX',
    title: "Zusammenarbeit der Propheten",
    description: "Build and lead high-performing AI-assisted development teams.",
    difficulty: "Expert", 
    xp: 375,
    readTime: 112,
    sacredSymbol: '👥',
    preview: "Ein einzelner Faden kann brechen, doch viele bilden ein unzerreißbares Seil..."
  },
  {
    number: 'X',
    title: "Die Monetarisierung",
    description: "Transform AI-built applications into profitable business empires.",
    difficulty: "Expert",
    xp: 450,
    readTime: 125,
    sacredSymbol: '💰',
    preview: "Das wahre Gold liegt in der Transformation von Code zu Wert..."
  }
]

// Sacred Components
const WorkshopsHero = () => (
  <section className="min-h-screen flex items-center justify-center relative">
    {/* Sacred Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900" />
    <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-black/50" />
    
    {/* Sacred Particles */}
    <div className="absolute top-20 left-20 text-amber-400 text-4xl animate-pulse">🔮</div>
    <div className="absolute top-40 right-32 text-purple-400 text-3xl animate-bounce delay-1000">✨</div>
    <div className="absolute bottom-32 left-1/3 text-amber-400 text-5xl animate-pulse delay-2000">📜</div>
    
    {/* Hero Content */}
    <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
      <div className="mb-8">
        <div className="text-8xl mb-6">🏛️</div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
        Sacred Workshops
      </h1>
      
      <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto">
        Meistere die{' '}
        <span className="text-amber-400 font-semibold">10 heiligen Gebote</span>
        {' '}der KI-unterstützten Entwicklung
      </p>
      
      {/* Sacred Stats */}
      <div className="flex flex-wrap justify-center gap-8 mb-8">
        <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg">
          <div className="text-2xl font-bold text-amber-400 mb-1">3,075</div>
          <div className="text-sm text-slate-400">Total XP</div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-400 mb-1">10</div>
          <div className="text-sm text-slate-400">Commandments</div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg">
          <div className="text-2xl font-bold text-indigo-400 mb-1">∞</div>
          <div className="text-sm text-slate-400">Divine Knowledge</div>
        </div>
      </div>
    </div>
  </section>
)

const WorkshopsGrid = () => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Advanced': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'Expert': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {commandments.map((commandment, index) => (
            <div key={commandment.number} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-purple-600/20 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300" />
              <div className="relative bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-amber-400/50 transition-all duration-300">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{commandment.number}</span>
                  </div>
                  <div className="text-3xl">{commandment.sacredSymbol}</div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-amber-400">
                  {commandment.title}
                </h3>
                
                {/* Description */}
                <p className="text-slate-300 mb-4 text-sm">
                  {commandment.description}
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
                  <span>{commandment.readTime} min</span>
                  <span className={`px-2 py-1 rounded border ${getDifficultyColor(commandment.difficulty)}`}>
                    {commandment.difficulty}
                  </span>
                  <span className="text-amber-400 font-semibold">{commandment.xp} XP</span>
                </div>
                
                {/* Preview */}
                <div className="mb-6 p-3 bg-slate-900/50 rounded-lg border border-amber-400/20">
                  <p className="text-xs text-amber-400 mb-1">Sacred Preview:</p>
                  <p className="text-xs text-slate-300 italic">
                    "{commandment.preview}"
                  </p>
                </div>
                
                {/* Actions */}
                <div className="space-y-2">
                  <Link href={`/workshops/${commandment.number.toLowerCase()}`}>
                    <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-purple-600 text-white font-medium rounded-lg hover:scale-105 transition-transform duration-300">
                      Begin Sacred Journey
                    </button>
                  </Link>
                  <button className="w-full py-2 border border-slate-600 text-slate-400 font-medium rounded-lg hover:bg-slate-700 transition-colors duration-300">
                    Preview Wisdom
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const WorkshopsCTA = () => (
  <section className="py-20 px-6 bg-slate-900/50">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-amber-400 to-purple-400 bg-clip-text text-transparent">
        Ready to Become a Sacred Developer?
      </h2>
      <p className="text-xl text-slate-300 mb-10">
        Complete all commandments to reach{' '}
        <span className="text-amber-400 font-semibold">Divine Prophet</span> status
      </p>
      
      <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl border border-amber-400/30 mb-8">
        <div className="text-3xl font-bold text-amber-400 mb-2">
          Total XP Available: 3,075
        </div>
        <div className="text-slate-400 mb-6">
          Master all 10 Sacred Commandments
        </div>
        
        <Link href="/workshops/i">
          <button className="px-12 py-4 bg-gradient-to-r from-amber-500 via-purple-600 to-amber-500 text-white font-bold text-lg rounded-lg shadow-2xl hover:scale-105 transition-all duration-300">
            <span className="flex items-center gap-3">
              <span className="text-2xl">👑</span>
              <span>Begin All Sacred Commandments</span>
              <span className="text-2xl">✨</span>
            </span>
          </button>
        </Link>
      </div>
    </div>
  </section>
)

export default function WorkshopsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <WorkshopsHero />
      <WorkshopsGrid />
      <WorkshopsCTA />
    </main>
  )
}