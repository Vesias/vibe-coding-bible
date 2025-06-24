import React from 'react'
import Link from 'next/link'
import { SacredButton } from '@/components/ui/sacred-button'

const AboutHero = () => (
  <section className="min-h-screen flex items-center justify-center relative">
    {/* Sacred Background */}
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #581c87 100%)'
    }} />
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(45deg, rgba(0,0,0,0.5) 0%, transparent 50%, rgba(0,0,0,0.5) 100%)'
    }} />
    
    {/* Sacred Particles */}
    <div className="absolute top-20 left-20 text-4xl animate-pulse" style={{ color: '#fbbf24' }}>🧙</div>
    <div className="absolute top-40 right-32 text-3xl animate-bounce" style={{ 
      color: '#c084fc',
      animationDelay: '1s'
    }}>✨</div>
    <div className="absolute bottom-32 left-1/3 text-5xl animate-pulse" style={{ 
      color: '#fbbf24',
      animationDelay: '2s'
    }}>📖</div>
    
    {/* Hero Content */}
    <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
      <div className="mb-8">
        <div className="text-8xl mb-6">🏛️</div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{
        background: 'linear-gradient(90deg, #fbbf24 0%, #c084fc 50%, #fbbf24 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Über die Vibe Coding Bibel
      </h1>
      
      <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto" style={{ color: '#cbd5e1' }}>
        Die heilige Mission zur{' '}
        <span className="font-semibold" style={{ color: '#fbbf24' }}>Transformation</span>
        {' '}der Softwareentwicklung durch KI-unterstützte Programmierung
      </p>
    </div>
  </section>
)

const AboutStory = () => (
  <section className="py-20 px-6" style={{ background: '#1e293b' }}>
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{
            background: 'linear-gradient(90deg, #fbbf24 0%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Unsere Geschichte
          </h2>
          <p className="text-lg mb-6" style={{ color: '#cbd5e1' }}>
            Die Vibe Coding Bibel entstand aus der Vision, Entwicklern zu helfen, das volle Potenzial 
            der KI-unterstützten Programmierung zu entdecken. In einer Welt, in der sich die Technologie 
            rasant entwickelt, erkannten wir die Notwendigkeit eines strukturierten Lernpfads.
          </p>
          <p className="text-lg mb-6" style={{ color: '#cbd5e1' }}>
            Gegründet von erfahrenen Entwicklern und KI-Experten, die zusammen über 50 Jahre 
            Branchenerfahrung mitbringen, ist unser Ziel einfach: Jedem Entwickler die Werkzeuge 
            und das Wissen zu geben, um in der neuen Ära der KI-unterstützten Entwicklung erfolgreich zu sein.
          </p>
          <div className="flex gap-4">
            <Link href="/workshops">
              <SacredButton className="px-8 py-3 font-bold">
                Lernreise beginnen
              </SacredButton>
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-xl opacity-20" style={{ background: 'linear-gradient(135deg, #fbbf24, #c084fc)', filter: 'blur(20px)' }} />
          <div className="relative p-8 rounded-xl border" style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            borderColor: '#475569'
          }}>
            <div className="text-6xl mb-4 text-center">🎯</div>
            <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: '#fbbf24' }}>Unsere Mission</h3>
            <p className="text-center" style={{ color: '#cbd5e1' }}>
              Entwickler weltweit zu befähigen, KI als ihren mächtigsten Verbündeten zu nutzen, 
              um außergewöhnliche Software zu erschaffen und ihre Produktivität exponentiell zu steigern.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const AboutValues = () => (
  <section className="py-20 px-6" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
          background: 'linear-gradient(90deg, #fbbf24 0%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Unsere Werte
        </h2>
        <p className="text-xl" style={{ color: '#94a3b8' }}>Die Prinzipien, die unsere heilige Mission leiten</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            icon: '🎓',
            title: 'Kontinuierliches Lernen',
            description: 'Wir glauben an lebenslanges Lernen und die ständige Weiterentwicklung unserer Fähigkeiten.',
            color: '#fbbf24'
          },
          {
            icon: '🤝',
            title: 'Community First',
            description: 'Unsere Gemeinschaft steht im Mittelpunkt. Wir wachsen zusammen und unterstützen uns gegenseitig.',
            color: '#c084fc'
          },
          {
            icon: '🚀',
            title: 'Innovation',
            description: 'Wir umarmen neue Technologien und suchen ständig nach besseren Wegen der Softwareentwicklung.',
            color: '#818cf8'
          },
          {
            icon: '💡',
            title: 'Praktisches Wissen',
            description: 'Theorie ist wichtig, aber praktische Anwendung bringt echte Ergebnisse.',
            color: '#10b981'
          },
          {
            icon: '🎯',
            title: 'Qualität',
            description: 'Wir setzen höchste Standards in allem was wir tun - von Inhalten bis hin zur Community-Erfahrung.',
            color: '#f59e0b'
          },
          {
            icon: '🌍',
            title: 'Zugänglichkeit',
            description: 'Hochwertige Bildung sollte für jeden zugänglich sein, unabhängig vom Hintergrund.',
            color: '#ef4444'
          }
        ].map((value, index) => (
          <div key={index} className="group relative">
            <div className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-30 transition-all duration-300" style={{ background: `linear-gradient(135deg, ${value.color}, ${value.color}90)`, filter: 'blur(20px)' }} />
            <div className="relative p-8 rounded-xl border transition-all duration-300" style={{
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(10px)',
              borderColor: '#475569'
            }}>
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold mb-4" style={{ color: value.color }}>{value.title}</h3>
              <p style={{ color: '#cbd5e1' }}>{value.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const AboutTeam = () => (
  <section className="py-20 px-6" style={{ background: '#1e293b' }}>
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
          background: 'linear-gradient(90deg, #fbbf24 0%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Unser Team
        </h2>
        <p className="text-xl" style={{ color: '#94a3b8' }}>Die Propheten hinter der heiligen Mission</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            name: 'Alex Müller',
            role: 'Gründer & AI Evangelist',
            description: '15+ Jahre Erfahrung in der Softwareentwicklung, spezialisiert auf AI/ML',
            emoji: '🧠'
          },
          {
            name: 'Sarah Chen',
            role: 'Lead Instructor',
            description: 'Ex-Google Engineer, Expertin für Developer Experience und Education',
            emoji: '👩‍🏫'
          },
          {
            name: 'Marcus Rodriguez',
            role: 'Community Manager',
            description: 'Aufbau und Führung von Tech-Communities mit über 50.000 Mitgliedern',
            emoji: '🌟'
          }
        ].map((member, index) => (
          <div key={index} className="group relative">
            <div className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-30 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #fbbf24, #c084fc)', filter: 'blur(20px)' }} />
            <div className="relative p-8 rounded-xl border transition-all duration-300 text-center" style={{
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(10px)',
              borderColor: '#475569'
            }}>
              <div className="text-6xl mb-4">{member.emoji}</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#fbbf24' }}>{member.name}</h3>
              <p className="text-lg mb-4" style={{ color: '#c084fc' }}>{member.role}</p>
              <p style={{ color: '#cbd5e1' }}>{member.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%)'
    }}>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutTeam />
      
      {/* CTA Section */}
      <section className="py-20 px-6" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{
            background: 'linear-gradient(90deg, #c084fc 0%, #fbbf24 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Bereit für deine Transformation?
          </h2>
          <p className="text-xl mb-10" style={{ color: '#cbd5e1' }}>
            Schließe dich Tausenden von Entwicklern an, die bereits ihre Coding-Fähigkeiten revolutioniert haben
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/workshops">
              <SacredButton size="lg" className="px-12 py-5 text-xl font-bold shadow-2xl">
                <span className="flex items-center gap-4">
                  <span className="text-3xl">⚡</span>
                  <span>Jetzt starten</span>
                  <span className="text-3xl">⚡</span>
                </span>
              </SacredButton>
            </Link>
            <Link href="/contact">
              <SacredButton variant="outline" size="lg" className="px-12 py-5 text-xl font-bold">
                <span className="flex items-center gap-4">
                  <span className="text-3xl">💬</span>
                  <span>Kontakt aufnehmen</span>
                </span>
              </SacredButton>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}