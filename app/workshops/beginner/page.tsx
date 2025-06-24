'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Users, 
  Star, 
  Zap, 
  Target, 
  Award,
  ArrowRight,
  Code,
  Lightbulb
} from 'lucide-react'

// Define the beginner workshops structure
const beginnerWorkshops = [
  {
    id: 'commandment-1',
    number: 'I',
    title: 'Das erste Gebot: Heilige Grundlagen',
    description: 'Lerne die fundamentalen Prinzipien der KI-unterstützten Entwicklung kennen und baue ein solides Fundament für deine Coding-Reise.',
    duration: '45 min',
    xp: 150,
    difficulty: 'Beginner',
    sacredSymbol: '⚡',
    completed: false,
    topics: [
      'Einführung in KI-Tools',
      'Setup und Konfiguration',
      'Erste Schritte mit Claude Code',
      'Grundlegende Prompting-Techniken'
    ],
    preview: 'Entdecke die Macht der KI-unterstützten Programmierung...'
  },
  {
    id: 'commandment-2',
    number: 'II',
    title: 'Das zweite Gebot: Intelligente Code-Erstellung',
    description: 'Meistere die Kunst der effizienten Code-Generierung mit KI-Assistenten und lerne, wie du produktiver wirst.',
    duration: '60 min',
    xp: 200,
    difficulty: 'Beginner',
    sacredSymbol: '🔮',
    completed: false,
    topics: [
      'Code-Generierung mit KI',
      'Effektive Prompts schreiben',
      'Code-Review und Optimierung',
      'Best Practices für KI-Assistenten'
    ],
    preview: 'Verwandle deine Ideen in funktionierenden Code...'
  }
]

const BeginnerHero = () => (
  <section className="min-h-screen flex items-center justify-center relative">
    {/* Sacred Background */}
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #22c55e 100%)'
    }} />
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(45deg, rgba(0,0,0,0.5) 0%, transparent 50%, rgba(0,0,0,0.5) 100%)'
    }} />
    
    {/* Sacred Particles */}
    <div className="absolute top-20 left-20 text-4xl animate-pulse" style={{ color: '#22c55e' }}>🌱</div>
    <div className="absolute top-40 right-32 text-3xl animate-bounce" style={{ 
      color: '#FFCE00',
      animationDelay: '1s'
    }}>✨</div>
    <div className="absolute bottom-32 left-1/3 text-5xl animate-pulse" style={{ 
      color: '#22c55e',
      animationDelay: '2s'
    }}>📚</div>
    
    {/* Hero Content */}
    <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
      <div className="mb-8">
        <div className="text-8xl mb-6">🌱</div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{
        background: 'linear-gradient(90deg, #22c55e 0%, #FFCE00 50%, #22c55e 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Beginner Workshop
      </h1>
      
      <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto" style={{ color: '#cbd5e1' }}>
        Starte deine heilige Reise mit den{' '}
        <span className="font-semibold" style={{ color: '#22c55e' }}>ersten beiden Geboten</span>
        {' '}der KI-unterstützten Entwicklung
      </p>
      
      {/* Sacred Stats */}
      <div className="flex flex-wrap justify-center gap-8 mb-8">
        <div className="p-4 rounded-lg backdrop-blur-sm" style={{
          background: 'rgba(30, 41, 59, 0.8)'
        }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#22c55e' }}>350</div>
          <div className="text-sm" style={{ color: '#94a3b8' }}>Total XP</div>
        </div>
        <div className="p-4 rounded-lg backdrop-blur-sm" style={{
          background: 'rgba(30, 41, 59, 0.8)'
        }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#FFCE00' }}>2</div>
          <div className="text-sm" style={{ color: '#94a3b8' }}>Gebote</div>
        </div>
        <div className="p-4 rounded-lg backdrop-blur-sm" style={{
          background: 'rgba(30, 41, 59, 0.8)'
        }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#009EE0' }}>105</div>
          <div className="text-sm" style={{ color: '#94a3b8' }}>Minuten</div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="#workshops" className="group">
          <button 
            className="px-8 py-4 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, #22c55e 0%, #FFCE00 100%)'
            }}
          >
            🌱 Heilige Reise beginnen
          </button>
        </Link>
        <Link href="/workshops" className="group">
          <button 
            className="px-8 py-4 border-2 font-semibold text-lg rounded-lg transition-all duration-300 hover:scale-105"
            style={{
              borderColor: '#22c55e',
              color: '#22c55e'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#22c55e'
              e.currentTarget.style.color = '#000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#22c55e'
            }}
          >
            📜 Alle Workshops
          </button>
        </Link>
      </div>
    </div>
  </section>
)

const LearningPath = () => (
  <section className="py-20 px-6" style={{ background: 'rgba(30, 41, 59, 0.3)' }}>
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
          background: 'linear-gradient(90deg, #22c55e 0%, #FFCE00 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Dein Beginner Lernpfad
        </h2>
        <p className="text-xl" style={{ color: '#94a3b8' }}>Folge dem göttlichen Curriculum für Einsteiger</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Step 1 */}
        <div className="relative">
          <div className="p-6 rounded-xl border" style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderColor: '#22c55e'
          }}>
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-3 text-green-400">1. Grundlagen</h3>
            <p className="mb-4 text-slate-300">Verstehe die Basics der KI-unterstützten Entwicklung</p>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>KI-Tools Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>Erste Prompts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>Code-Verständnis</span>
              </div>
            </div>
          </div>
          
          {/* Connector */}
          <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-400 to-yellow-400"></div>
        </div>

        {/* Step 2 */}
        <div className="relative">
          <div className="p-6 rounded-xl border" style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderColor: '#FFCE00'
          }}>
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3 text-yellow-400">2. Code-Erstellung</h3>
            <p className="mb-4 text-slate-300">Lerne effiziente Code-Generierung mit KI</p>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-yellow-400" />
                <span>Smart Prompting</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-yellow-400" />
                <span>Code Review</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-yellow-400" />
                <span>Optimierung</span>
              </div>
            </div>
          </div>
          
          {/* Connector */}
          <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-yellow-400 to-blue-400"></div>
        </div>

        {/* Step 3 */}
        <div>
          <div className="p-6 rounded-xl border" style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderColor: '#009EE0'
          }}>
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-3 text-blue-400">3. Meisterschaft</h3>
            <p className="mb-4 text-slate-300">Erreiche Beginner-Meisterschaft und mehr</p>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-blue-400" />
                <span>350 XP erreichen</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-blue-400" />
                <span>Zertifikat erhalten</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-blue-400" />
                <span>Intermediate freischalten</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const WorkshopsGrid = () => {
  const [completedWorkshops, setCompletedWorkshops] = useState<Set<string>>(new Set())

  const toggleCompletion = (workshopId: string) => {
    const newCompleted = new Set(completedWorkshops)
    if (newCompleted.has(workshopId)) {
      newCompleted.delete(workshopId)
    } else {
      newCompleted.add(workshopId)
    }
    setCompletedWorkshops(newCompleted)
  }

  return (
    <section className="py-20 px-6" id="workshops">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
            background: 'linear-gradient(90deg, #22c55e 0%, #FFCE00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Beginner Workshops
          </h2>
          <p className="text-xl" style={{ color: '#94a3b8' }}>Starte mit den ersten beiden heiligen Geboten</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {beginnerWorkshops.map((workshop, index) => {
            const isCompleted = completedWorkshops.has(workshop.id)
            const isUnlocked = index === 0 || completedWorkshops.has(beginnerWorkshops[index - 1].id)
            
            return (
              <div key={workshop.id} className="group relative">
                <div className="absolute inset-0 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300" style={{
                  background: isCompleted 
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(255, 206, 0, 0.3) 100%)'
                    : 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(255, 206, 0, 0.2) 100%)'
                }} />
                
                <div 
                  className="relative backdrop-blur-sm p-8 rounded-xl border transition-all duration-300" 
                  style={{
                    background: isCompleted 
                      ? 'rgba(34, 197, 94, 0.1)' 
                      : 'rgba(30, 41, 59, 0.8)',
                    borderColor: isCompleted 
                      ? '#22c55e' 
                      : '#475569',
                    opacity: isUnlocked ? 1 : 0.6
                  }}
                  onMouseEnter={(e) => {
                    if (isUnlocked) {
                      e.currentTarget.style.borderColor = isCompleted ? '#22c55e' : 'rgba(34, 197, 94, 0.5)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isCompleted ? '#22c55e' : '#475569'
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                        style={{
                          background: isCompleted 
                            ? 'linear-gradient(90deg, #22c55e 0%, #FFCE00 100%)'
                            : 'linear-gradient(90deg, #FFCE00 0%, #22c55e 100%)',
                          color: '#000'
                        }}
                      >
                        {workshop.number}
                      </div>
                      <div>
                        <div className="text-3xl mb-2">{workshop.sacredSymbol}</div>
                        {isCompleted && (
                          <div className="flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-400" />
                            <span className="text-sm text-green-400 font-medium">Abgeschlossen</span>
                          </div>
                        )}
                        {!isUnlocked && (
                          <div className="text-sm text-slate-500">🔒 Gesperrt</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm" style={{ color: '#94a3b8' }}>Schwierigkeit</div>
                      <div 
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: 'rgba(34, 197, 94, 0.2)',
                          color: '#22c55e',
                          border: '1px solid rgba(34, 197, 94, 0.3)'
                        }}
                      >
                        {workshop.difficulty}
                      </div>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-4" style={{ color: isCompleted ? '#22c55e' : '#FFCE00' }}>
                    {workshop.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="mb-6 text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>
                    {workshop.description}
                  </p>
                  
                  {/* Topics */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3" style={{ color: '#94a3b8' }}>
                      Was du lernst:
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {workshop.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-center gap-3">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ background: '#22c55e' }}
                          />
                          <span className="text-sm" style={{ color: '#cbd5e1' }}>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-6 text-sm" style={{ color: '#94a3b8' }}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{workshop.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap size={16} />
                        <span className="font-semibold" style={{ color: '#FFCE00' }}>{workshop.xp} XP</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-3">
                    {isUnlocked ? (
                      <>
                        <Link href={`/workshops/${workshop.number.toLowerCase()}`}>
                          <button 
                            className="w-full py-3 text-white font-medium rounded-lg hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2"
                            style={{
                              background: isCompleted 
                                ? 'linear-gradient(90deg, #22c55e 0%, #FFCE00 100%)'
                                : 'linear-gradient(90deg, #FFCE00 0%, #22c55e 100%)'
                            }}
                          >
                            {isCompleted ? (
                              <>
                                <Award size={18} />
                                <span>Workshop wiederholen</span>
                              </>
                            ) : (
                              <>
                                <Play size={18} />
                                <span>Workshop starten</span>
                              </>
                            )}
                          </button>
                        </Link>
                        
                        <button 
                          onClick={() => toggleCompletion(workshop.id)}
                          className="w-full py-2 border font-medium rounded-lg transition-colors duration-300 flex items-center justify-center gap-2" 
                          style={{
                            borderColor: isCompleted ? '#22c55e' : '#475569',
                            color: isCompleted ? '#22c55e' : '#94a3b8'
                          }}
                          onMouseEnter={(e) => {
                            if (!isCompleted) {
                              e.currentTarget.style.backgroundColor = '#374151'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isCompleted) {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }
                          }}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle size={16} />
                              <span>Abgeschlossen</span>
                            </>
                          ) : (
                            <>
                              <Target size={16} />
                              <span>Als abgeschlossen markieren</span>
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <button 
                        disabled
                        className="w-full py-3 border font-medium rounded-lg opacity-50 cursor-not-allowed" 
                        style={{
                          borderColor: '#475569',
                          color: '#94a3b8'
                        }}
                      >
                        🔒 Vorherigen Workshop abschließen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const BeginnerCTA = () => (
  <section className="py-20 px-6" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{
        background: 'linear-gradient(90deg, #22c55e 0%, #FFCE00 50%, #22c55e 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Bereit für den nächsten Schritt?
      </h2>
      <p className="text-xl mb-10" style={{ color: '#cbd5e1' }}>
        Schließe beide Beginner-Workshops ab und schalte{' '}
        <span className="font-semibold" style={{ color: '#FFCE00' }}>Intermediate-Level</span> frei
      </p>
      
      <div className="backdrop-blur-sm p-8 rounded-xl border mb-8" style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderColor: 'rgba(34, 197, 94, 0.3)'
      }}>
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: '#22c55e' }}>
              350
            </div>
            <div style={{ color: '#94a3b8' }}>XP zu sammeln</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: '#FFCE00' }}>
              2
            </div>
            <div style={{ color: '#94a3b8' }}>Workshops abzuschließen</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: '#009EE0' }}>
              ∞
            </div>
            <div style={{ color: '#94a3b8' }}>Möglichkeiten zu entdecken</div>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/workshops/i">
            <button className="px-8 py-4 text-white font-bold text-lg rounded-lg shadow-2xl hover:scale-105 transition-all duration-300" style={{
              background: 'linear-gradient(90deg, #22c55e 0%, #FFCE00 50%, #22c55e 100%)'
            }}>
              <span className="flex items-center gap-3">
                <span className="text-2xl">🌱</span>
                <span>Erstes Gebot starten</span>
                <ArrowRight size={20} />
              </span>
            </button>
          </Link>
          <Link href="/workshops">
            <button className="px-8 py-4 border-2 font-bold text-lg rounded-lg transition-all duration-300 hover:scale-105" style={{
              borderColor: '#22c55e',
              color: '#22c55e'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#22c55e'
              e.currentTarget.style.color = '#000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#22c55e'
            }}>
              <span className="flex items-center gap-3">
                <span className="text-2xl">📜</span>
                <span>Alle Workshops</span>
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  </section>
)

export default function BeginnerWorkshopPage() {
  return (
    <main className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%)'
    }}>
      <BeginnerHero />
      <LearningPath />
      <WorkshopsGrid />
      <BeginnerCTA />
    </main>
  )
}