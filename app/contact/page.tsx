'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { SacredButton } from '@/components/ui/sacred-button'

const ContactHero = () => (
  <section className="min-h-screen flex items-center justify-center relative">
    {/* Sacred Background */}
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #581c87 100%)'
    }} />
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(45deg, rgba(0,0,0,0.5) 0%, transparent 50%, rgba(0,0,0,0.5) 100%)'
    }} />
    
    {/* Sacred Particles */}
    <div className="absolute top-20 left-20 text-4xl animate-pulse" style={{ color: '#fbbf24' }}>📞</div>
    <div className="absolute top-40 right-32 text-3xl animate-bounce" style={{ 
      color: '#c084fc',
      animationDelay: '1s'
    }}>✨</div>
    <div className="absolute bottom-32 left-1/3 text-5xl animate-pulse" style={{ 
      color: '#fbbf24',
      animationDelay: '2s'
    }}>💬</div>
    
    {/* Hero Content */}
    <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
      <div className="mb-8">
        <div className="text-8xl mb-6">🤝</div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{
        background: 'linear-gradient(90deg, #fbbf24 0%, #c084fc 50%, #fbbf24 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Kontakt
      </h1>
      
      <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto" style={{ color: '#cbd5e1' }}>
        Hast du Fragen, Feedback oder möchtest du{' '}
        <span className="font-semibold" style={{ color: '#fbbf24' }}>zusammenarbeiten</span>?
        {' '}Wir sind hier, um zu helfen!
      </p>
    </div>
  </section>
)

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsSubmitting(false)
    
    // Show success message (you can implement proper toast notification here)
    alert('Nachricht erfolgreich gesendet! Wir melden uns bald bei dir.')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section className="py-20 px-6" style={{ background: '#1e293b' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-4xl font-bold mb-8" style={{
              background: 'linear-gradient(90deg, #fbbf24 0%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Nachricht senden
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    borderColor: '#475569',
                    color: '#fff'
                  }}
                  placeholder="Dein Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                  E-Mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    borderColor: '#475569',
                    color: '#fff'
                  }}
                  placeholder="deine.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                  Betreff *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    borderColor: '#475569',
                    color: '#fff'
                  }}
                >
                  <option value="">Wähle einen Betreff</option>
                  <option value="general">Allgemeine Anfrage</option>
                  <option value="support">Technischer Support</option>
                  <option value="partnership">Partnerschaft/Kooperation</option>
                  <option value="feedback">Feedback</option>
                  <option value="press">Presse/Medien</option>
                  <option value="other">Sonstiges</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                  Nachricht *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 resize-vertical"
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    borderColor: '#475569',
                    color: '#fff'
                  }}
                  placeholder="Schreibe deine Nachricht hier..."
                />
              </div>

              <SacredButton
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Wird gesendet...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <span className="text-2xl">📧</span>
                    Nachricht senden
                  </span>
                )}
              </SacredButton>
            </form>
          </div>

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="p-8 rounded-xl border" style={{
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(10px)',
              borderColor: '#475569'
            }}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#fbbf24' }}>
                🚀 Weitere Kontaktmöglichkeiten
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">💬</div>
                  <div>
                    <p className="font-semibold" style={{ color: '#fff' }}>Discord Community</p>
                    <p style={{ color: '#94a3b8' }}>24/7 Community Support</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-2xl">📧</div>
                  <div>
                    <p className="font-semibold" style={{ color: '#fff' }}>E-Mail Support</p>
                    <p style={{ color: '#94a3b8' }}>support@vibecodingbible.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-2xl">🎥</div>
                  <div>
                    <p className="font-semibold" style={{ color: '#fff' }}>Live Sessions</p>
                    <p style={{ color: '#94a3b8' }}>Wöchentliche Q&A Runden</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="p-8 rounded-xl border" style={{
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(10px)',
              borderColor: '#475569'
            }}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#c084fc' }}>
                ❓ Häufige Fragen
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-2" style={{ color: '#fff' }}>
                    Wie schnell bekomme ich eine Antwort?
                  </p>
                  <p style={{ color: '#94a3b8' }}>
                    Wir antworten in der Regel innerhalb von 24 Stunden.
                  </p>
                </div>
                
                <div>
                  <p className="font-semibold mb-2" style={{ color: '#fff' }}>
                    Bietet ihr individuelle Beratung an?
                  </p>
                  <p style={{ color: '#94a3b8' }}>
                    Ja! Premium-Mitglieder erhalten Zugang zu 1:1 Mentoring-Sessions.
                  </p>
                </div>
                
                <div>
                  <p className="font-semibold mb-2" style={{ color: '#fff' }}>
                    Kann ich eine Demo-Session buchen?
                  </p>
                  <p style={{ color: '#94a3b8' }}>
                    Natürlich! Kontaktiere uns für eine persönliche Demo unserer Plattform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ContactPage() {
  return (
    <main className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%)'
    }}>
      <ContactHero />
      <ContactForm />
      
      {/* CTA Section */}
      <section className="py-20 px-6" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{
            background: 'linear-gradient(90deg, #c084fc 0%, #fbbf24 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Bereit, loszulegen?
          </h2>
          <p className="text-xl mb-10" style={{ color: '#cbd5e1' }}>
            Während du auf unsere Antwort wartest, kannst du bereits mit deiner Lernreise beginnen
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/workshops">
              <SacredButton size="lg" className="px-12 py-5 text-xl font-bold shadow-2xl">
                <span className="flex items-center gap-4">
                  <span className="text-3xl">🚀</span>
                  <span>Workshops starten</span>
                  <span className="text-3xl">🚀</span>
                </span>
              </SacredButton>
            </Link>
            <Link href="/community">
              <SacredButton variant="outline" size="lg" className="px-12 py-5 text-xl font-bold">
                <span className="flex items-center gap-4">
                  <span className="text-3xl">👥</span>
                  <span>Community beitreten</span>
                </span>
              </SacredButton>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}