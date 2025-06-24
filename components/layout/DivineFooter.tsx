'use client'

import React from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Users, 
  Sparkles, 
  Mail, 
  Github, 
  Twitter, 
  Crown,
  ExternalLink,
  Heart,
  Zap
} from 'lucide-react'

interface FooterLinkProps {
  href: string
  children: React.ReactNode
  external?: boolean
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children, external = false }) => (
  <Link href={href} className="group" target={external ? '_blank' : '_self'} rel={external ? 'noopener noreferrer' : undefined}>
    <div
      style={{
        color: '#94a3b8',
        fontSize: '0.875rem',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
      className="footer-link"
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#FFCE00'
        e.currentTarget.style.transform = 'translateX(4px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#94a3b8'
        e.currentTarget.style.transform = 'translateX(0)'
      }}
    >
      {children}
      {external && <ExternalLink size={12} />}
    </div>
  </Link>
)

const SocialLink: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer">
    <div
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 206, 0, 0.1)',
        border: '1px solid rgba(255, 206, 0, 0.3)',
        color: '#FFCE00',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 206, 0, 0.2)'
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 206, 0, 0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 206, 0, 0.1)'
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      title={label}
    >
      {icon}
    </div>
  </Link>
)

export const DivineFooter: React.FC = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%)',
      borderTop: '1px solid rgba(255, 206, 0, 0.2)'
    }}>
      {/* Main Footer Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Brand Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ fontSize: '2rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
                📜
              </div>
              <div>
                <div style={{
                  background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  fontFamily: 'Cinzel, serif'
                }}>
                  Vibe Coding Bibel
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  background: 'linear-gradient(90deg, #009EE0 0%, #004A8F 50%, #FFCE00 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent'
                }}>
                  Interaktive E-Book Workshops
                </div>
              </div>
            </div>
            
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '0.875rem', 
              lineHeight: '1.6',
              marginBottom: '24px',
              maxWidth: '280px'
            }}>
              Meistere KI-unterstützte Entwicklung mit den 10 heiligen Geboten der göttlichen Programmierung. 
              Verwandle deine Coding-Praxis mit heiliger Weisheit.
            </p>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <SocialLink 
                href="https://github.com/agentland" 
                icon={<Github size={18} />} 
                label="GitHub"
              />
              <SocialLink 
                href="https://twitter.com/agentland" 
                icon={<Twitter size={18} />} 
                label="Twitter"
              />
              <SocialLink 
                href="mailto:hello@agentland.saarland" 
                icon={<Mail size={18} />} 
                label="E-Mail"
              />
            </div>
          </div>

          {/* Learning Section */}
          <div>
            <h3 style={{
              color: '#FFCE00',
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <BookOpen size={20} />
              Lernen
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <FooterLink href="/workshops">Alle Workshops</FooterLink>
              <FooterLink href="/workshops/beginner">Beginner Workshop</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/community">Community</FooterLink>
              <FooterLink href="/collaboration">Kollaboration</FooterLink>
            </div>
          </div>

          {/* Company Section */}
          <div>
            <h3 style={{
              color: '#009EE0',
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Crown size={20} />
              Unternehmen
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <FooterLink href="/about">Über uns</FooterLink>
              <FooterLink href="/pricing">Preise</FooterLink>
              <FooterLink href="/contact">Kontakt</FooterLink>
              <FooterLink href="/referrals">Affiliate Programm</FooterLink>
            </div>
          </div>

          {/* Agent Land Section */}
          <div>
            <h3 style={{
              color: '#004A8F',
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Sparkles size={20} />
              Agent Land
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <FooterLink href="https://agentland.saarland" external>
                Agent Land Homepage
              </FooterLink>
              <FooterLink href="https://agentland.saarland/projects" external>
                Weitere Projekte
              </FooterLink>
              <FooterLink href="https://agentland.saarland/about" external>
                Über Agent Land
              </FooterLink>
              <FooterLink href="https://agentland.saarland/contact" external>
                Agent Land Kontakt
              </FooterLink>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '48px',
          border: '1px solid rgba(255, 206, 0, 0.2)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{
                color: '#FFCE00',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Zap size={24} />
                Bleibe auf dem göttlichen Pfad
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6' }}>
                Erhalte exklusive Einblicke, neue Workshop-Updates und heilige Coding-Weisheiten direkt in dein Postfach.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="Deine heilige E-Mail Adresse"
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '12px 16px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 206, 0, 0.3)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#FFCE00'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 206, 0, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 206, 0, 0.3)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              <button
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 206, 0, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Abonnieren
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 206, 0, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              © 2024 Vibe Coding Bibel. Alle Rechte vorbehalten.
            </div>
            
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <Link href="/privacy" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>
                Datenschutz
              </Link>
              <Link href="/terms" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>
                Nutzungsbedingungen
              </Link>
              <Link href="/imprint" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>
                Impressum
              </Link>
            </div>
          </div>
          
          {/* Powered by Agent Land */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 206, 0, 0.1)'
          }}>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
              Erstellt mit
            </span>
            <Heart size={12} style={{ color: '#ef4444' }} />
            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
              von
            </span>
            <Link 
              href="https://agentland.saarland" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: '#FFCE00',
                fontSize: '0.75rem',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#009EE0'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#FFCE00'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <Sparkles size={12} />
              Agent Land
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default DivineFooter