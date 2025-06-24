'use client'

import React from 'react'
import Link from 'next/link'
import { SacredButton } from '@/components/ui/sacred-button'

import { getAllWorkshops } from '@/lib/workshop/workshop-content-migrated'

const commandments = getAllWorkshops().map(workshop => ({
  number: workshop.commandmentNumber,
  title: workshop.title,
  description: workshop.description,
  difficulty: workshop.difficulty,
  xp: workshop.totalXP,
  readTime: workshop.estimatedTime,
  sacredSymbol: workshop.sacredSymbol,
  preview: workshop.sacredWisdom
}))

// Sacred Components
const WorkshopsHero = () => (
  <section className="min-h-screen flex items-center justify-center relative">
    {/* Sacred Background */}
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #581c87 100%)'
    }} />
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(45deg, rgba(0,0,0,0.5) 0%, transparent 50%, rgba(0,0,0,0.5) 100%)'
    }} />
    
    {/* Sacred Particles */}
    <div className="absolute top-20 left-20 text-4xl animate-pulse" style={{ color: '#FFCE00' }}>🔮</div>
    <div className="absolute top-40 right-32 text-3xl animate-bounce" style={{ 
      color: '#009EE0',
      animationDelay: '1s'
    }}>✨</div>
    <div className="absolute bottom-32 left-1/3 text-5xl animate-pulse" style={{ 
      color: '#FFCE00',
      animationDelay: '2s'
    }}>📜</div>
    
    {/* Hero Content */}
    <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
      <div className="mb-8">
        <div className="text-8xl mb-6">🏛️</div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{
        background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 50%, #FFCE00 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Sacred Workshops
      </h1>
      
      <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto" style={{ color: '#cbd5e1' }}>
        Meistere die{' '}
        <span className="font-semibold" style={{ color: '#FFCE00' }}>10 heiligen Gebote</span>
        {' '}der KI-unterstützten Entwicklung
      </p>
      
      {/* Sacred Stats */}
      <div className="flex flex-wrap justify-center gap-8 mb-8">
        <div className="p-4 rounded-lg backdrop-blur-sm" style={{
          background: 'rgba(30, 41, 59, 0.8)'
        }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#FFCE00' }}>3,075</div>
          <div className="text-sm" style={{ color: '#94a3b8' }}>Total XP</div>
        </div>
        <div className="p-4 rounded-lg backdrop-blur-sm" style={{
          background: 'rgba(30, 41, 59, 0.8)'
        }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#009EE0' }}>10</div>
          <div className="text-sm" style={{ color: '#94a3b8' }}>Commandments</div>
        </div>
        <div className="p-4 rounded-lg backdrop-blur-sm" style={{
          background: 'rgba(30, 41, 59, 0.8)'
        }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#004A8F' }}>∞</div>
          <div className="text-sm" style={{ color: '#94a3b8' }}>Divine Knowledge</div>
        </div>
      </div>
    </div>
  </section>
)

const WorkshopsFilter = () => {
  const [activeFilter, setActiveFilter] = React.useState('All')
  const filters = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert']
  
  return (
    <div className="flex justify-center mb-12 gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            activeFilter === filter
              ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-lg'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

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
        <WorkshopsFilter />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {commandments.map((commandment, index) => (
            <div key={commandment.number} className="group relative">
              <div className="absolute inset-0 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300" style={{
                background: 'linear-gradient(135deg, rgba(255, 206, 0, 0.2) 0%, rgba(0, 158, 224, 0.2) 100%)'
              }} />
              <div className="relative backdrop-blur-sm p-6 rounded-xl border transition-all duration-300" style={{
                background: 'rgba(30, 41, 59, 0.8)',
                borderColor: '#475569'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 206, 0, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#475569'
              }}>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                    background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)'
                  }}>
                    <span className="text-white font-bold text-lg">{commandment.number}</span>
                  </div>
                  <div className="text-3xl">{commandment.sacredSymbol}</div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-3" style={{ color: '#FFCE00' }}>
                  {commandment.title}
                </h3>
                
                {/* Description */}
                <p className="mb-4 text-sm" style={{ color: '#cbd5e1' }}>
                  {commandment.description}
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between mb-4 text-xs" style={{ color: '#94a3b8' }}>
                  <span>{commandment.readTime} min</span>
                  <span className={`px-2 py-1 rounded border ${getDifficultyColor(commandment.difficulty)}`}>
                    {commandment.difficulty}
                  </span>
                  <span className="font-semibold" style={{ color: '#FFCE00' }}>{commandment.xp} XP</span>
                </div>
                
                {/* Preview */}
                <div className="mb-6 p-3 rounded-lg border" style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderColor: 'rgba(255, 206, 0, 0.2)'
                }}>
                  <p className="text-xs mb-1" style={{ color: '#FFCE00' }}>Sacred Preview:</p>
                  <p className="text-xs italic" style={{ color: '#cbd5e1' }}>
                    "{commandment.preview}"
                  </p>
                </div>
                
                {/* Actions */}
                <div className="space-y-2">
                  <Link href={`/workshops/${commandment.number.toLowerCase()}`}>
                    <SacredButton className="w-full py-3">
                      Begin Sacred Journey
                    </SacredButton>
                  </Link>
                  <button 
                    className="w-full py-2 border font-medium rounded-lg transition-colors duration-300" 
                    style={{
                      borderColor: '#475569',
                      color: '#94a3b8'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#374151'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
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

const LearningPath = () => (
  <section className="py-20 px-6" style={{ background: 'rgba(30, 41, 59, 0.3)' }}>
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
          background: 'linear-gradient(90deg, #fbbf24 0%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Dein Heiliger Lernpfad
        </h2>
        <p className="text-xl" style={{ color: '#94a3b8' }}>Folge dem göttlichen Curriculum zur Meisterschaft</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-6 rounded-xl border" style={{
          background: 'rgba(30, 41, 59, 0.8)',
          borderColor: '#22c55e'
        }}>
          <div className="text-4xl mb-4">🌱</div>
          <h3 className="text-xl font-bold mb-3 text-green-400">Beginner Path</h3>
          <p className="mb-4 text-slate-300">Starte deine Reise mit den Grundlagen der KI-unterstützten Entwicklung</p>
          <div className="space-y-2">
            <div className="text-sm text-slate-400">Gebote I-II</div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <div className="text-xs text-slate-400">0/2 abgeschlossen</div>
          </div>
          <Link href="/workshops/beginner">
            <SacredButton className="w-full mt-4 py-2" variant="secondary">
              Beginnen
            </SacredButton>
          </Link>
        </div>

        <div className="p-6 rounded-xl border" style={{
          background: 'rgba(30, 41, 59, 0.8)',
          borderColor: '#FFCE00'
        }}>
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold mb-3 text-yellow-400">Advanced Path</h3>
          <p className="mb-4 text-slate-300">Entwickle fortgeschrittene Fähigkeiten und Strategien</p>
          <div className="space-y-2">
            <div className="text-sm text-slate-400">Gebote III-VII</div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <div className="text-xs text-slate-400">0/5 abgeschlossen</div>
          </div>
          <Link href="/workshops/intermediate">
            <SacredButton className="w-full mt-4 py-2">
              Fortfahren
            </SacredButton>
          </Link>
        </div>

        <div className="p-6 rounded-xl border" style={{
          background: 'rgba(30, 41, 59, 0.8)',
          borderColor: '#dc2626'
        }}>
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold mb-3 text-red-400">Expert Path</h3>
          <p className="mb-4 text-slate-300">Erreiche Meisterschaft und monetarisiere deine Fähigkeiten</p>
          <div className="space-y-2">
            <div className="text-sm text-slate-400">Gebote VIII-X</div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-red-400 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <div className="text-xs text-slate-400">0/3 abgeschlossen</div>
          </div>
          <Link href="/workshops/advanced">
            <SacredButton className="w-full mt-4 py-2">
              Meistern
            </SacredButton>
          </Link>
        </div>
      </div>
    </div>
  </section>
)

const WorkshopsCTA = () => (
  <section className="py-20 px-6" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{
        background: 'linear-gradient(90deg, #009EE0 0%, #FFCE00 50%, #009EE0 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Ready to Become a Sacred Developer?
      </h2>
      <p className="text-xl mb-10" style={{ color: '#cbd5e1' }}>
        Complete all commandments to reach{' '}
        <span className="font-semibold" style={{ color: '#FFCE00' }}>Divine Prophet</span> status
      </p>
      
      <div className="backdrop-blur-sm p-8 rounded-xl border mb-8" style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderColor: 'rgba(255, 206, 0, 0.3)'
      }}>
        <div className="text-3xl font-bold mb-2" style={{ color: '#FFCE00' }}>
          Total XP Available: 3,075
        </div>
        <div className="mb-6" style={{ color: '#94a3b8' }}>
          Master all 10 Sacred Commandments
        </div>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/workshops/i">
            <SacredButton size="lg" className="px-8 py-4 text-lg font-bold shadow-2xl">
              <span className="flex items-center gap-3">
                <span className="text-2xl">👑</span>
                <span>Begin All Sacred Commandments</span>
                <span className="text-2xl">✨</span>
              </span>
            </SacredButton>
          </Link>
          <Link href="/pricing">
            <button className="px-8 py-4 border-2 font-bold text-lg rounded-lg transition-all duration-300 hover:scale-105" style={{
              borderColor: '#FFCE00',
              color: '#FFCE00'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFCE00'
              e.currentTarget.style.color = '#000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#FFCE00'
            }}>
              <span className="flex items-center gap-3">
                <span className="text-2xl">💰</span>
                <span>Premium Zugang</span>
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  </section>
)

export default function WorkshopsPage() {
  return (
    <main className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%)'
    }}>
      <WorkshopsHero />
      <LearningPath />
      <WorkshopsGrid />
      <WorkshopsCTA />
    </main>
  )
}