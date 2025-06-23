'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { 
  Crown, 
  Sparkles, 
  Play, 
  BookOpen, 
  Users, 
  Zap, 
  Star,
  ArrowRight,
  Gift,
  Clock,
  Shield,
  Infinity,
  Rocket,
  Heart,
  Code,
  Trophy,
  MessageCircle,
  Download
} from 'lucide-react'
import { SacredGeometry } from '@/components/illustrations/SacredGeometry'

const ctaOptions = [
  {
    title: 'Begin Your Sacred Journey',
    subtitle: 'Start with the 10 Commandments',
    description: 'Embark on the complete transformation from coding novice to AI-assisted development prophet. Master all 10 sacred commandments.',
    features: [
      'Complete 10-Commandment Workshop Series',
      'AI Mentor Guidance Throughout',
      'Hands-on Project Portfolio',
      'Sacred Community Access',
      'Prophet Certification'
    ],
    icon: Crown,
    href: '/workshops',
    primary: true,
    color: 'from-sacred-gold to-sacred-purple',
    glowColor: 'shadow-sacred-gold/50',
    pattern: 'flower-of-life'
  },
  {
    title: 'Join the Sacred Community',
    subtitle: 'Connect with Fellow Prophets',
    description: 'Join an elite community of AI-assisted developers. Share knowledge, collaborate on projects, and grow together.',
    features: [
      'Exclusive Prophet Discord Server',
      'Weekly Coding Challenges',
      'Project Collaboration Hub',
      'Expert AMAs & Workshops',
      'Lifetime Access'
    ],
    icon: Users,
    href: '/community',
    primary: false,
    color: 'from-vibe-primary to-vibe-secondary',
    glowColor: 'shadow-vibe-primary/50',
    pattern: 'mandala'
  },
  {
    title: 'Download Sacred Resources',
    subtitle: 'Essential Tools & Templates',
    description: 'Get instant access to our curated collection of AI prompts, project templates, and development tools.',
    features: [
      '500+ Sacred AI Prompts',
      'Project Starter Templates',
      'Development Checklists',
      'Tool Configuration Guides',
      'Regular Updates'
    ],
    icon: Download,
    href: '/resources',
    primary: false,
    color: 'from-vibe-accent to-emerald-500',
    glowColor: 'shadow-vibe-accent/50',
    pattern: 'golden-spiral'
  }
]

const testimonials = [
  {
    quote: "The Vibe Coding Bible transformed my entire approach to development. I've built 3 profitable SaaS products in 6 months using these sacred techniques.",
    author: "Sarah Chen",
    role: "Full-Stack Prophet",
    avatar: "SC",
    company: "TechStarts Inc"
  },
  {
    quote: "From junior developer to senior architect in 8 months. The AI-assisted workflows taught here are absolutely revolutionary.",
    author: "Marcus Rodriguez",
    role: "AI Development Lead",
    avatar: "MR",
    company: "DevCorp Solutions"
  },
  {
    quote: "I thought I knew development until I discovered the sacred commandments. This is the future of coding, and I'm here for it.",
    author: "Emily Thompson",
    role: "Startup Founder",
    avatar: "ET",
    company: "CodeFlow Systems"
  }
]

export function SacredCTASection() {
  const [hoveredCTA, setHoveredCTA] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section 
      ref={containerRef}
      className="relative py-32 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden"
    >
      {/* Animated Sacred Background */}
      <motion.div 
        className="absolute inset-0 opacity-15"
        style={{ y }}
      >
        <div className="absolute top-1/4 left-1/6">
          <SacredGeometry pattern="tree-of-life" size={600} color="#6366F1" accentColor="#D4AF37" animated={true} />
        </div>
        <div className="absolute bottom-1/4 right-1/6">
          <SacredGeometry pattern="sri-yantra" size={500} color="#7C3AED" accentColor="#EC4899" animated={true} />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <SacredGeometry pattern="torus" size={800} color="#10B981" accentColor="#F59E0B" animated={true} />
        </div>
      </motion.div>

      {/* Mystical Light Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-sacred-gold/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-sacred-purple/10 via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge 
            variant="outline" 
            className="border-sacred-gold/50 bg-sacred-gold/10 text-sacred-gold mb-8 px-8 py-4 text-lg font-medium shadow-lg shadow-sacred-gold/20"
          >
            <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
            The Sacred Moment Has Arrived
            <Crown className="w-6 h-6 ml-3" />
          </Badge>
          
          <h2 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-8 text-white font-sacred">
            <span className="bg-gradient-to-r from-sacred-gold via-sacred-purple to-vibe-primary bg-clip-text text-transparent">
              Choose Your Path
            </span>
            <br />
            <span className="text-4xl sm:text-5xl md:text-6xl">to Digital Enlightenment</span>
          </h2>
          
          <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed mb-8">
            Three sacred paths await your decision. Each leads to mastery, but the journey begins with a single choice.
            Which path calls to your developer soul?
          </p>

          {/* Urgency Indicator */}
          <div className="inline-flex items-center gap-3 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-full px-6 py-3 text-red-400">
            <Clock className="w-5 h-5 animate-pulse" />
            <span className="font-medium">Limited time: Early Prophet pricing ends soon</span>
          </div>
        </motion.div>

        {/* CTA Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {ctaOptions.map((cta, index) => {
            const Icon = cta.icon
            const isHovered = hoveredCTA === index
            const isPrimary = cta.primary
            
            return (
              <motion.div
                key={cta.title}
                className={`group relative ${isPrimary ? 'lg:scale-110 lg:-translate-y-4' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                onHoverStart={() => setHoveredCTA(index)}
                onHoverEnd={() => setHoveredCTA(null)}
              >
                {/* Primary CTA Badge */}
                {isPrimary && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-gradient-to-r from-sacred-gold to-yellow-400 text-black font-bold px-4 py-2 shadow-lg">
                      <Crown className="w-4 h-4 mr-2" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Sacred Geometry Background */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-500">
                  <SacredGeometry 
                    pattern={cta.pattern as any}
                    size={400}
                    color="#6366F1"
                    accentColor="#D4AF37"
                    animated={isHovered}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                </div>

                <div className={`
                  prophet-card h-full bg-white/5 backdrop-blur-sm border-2 
                  ${isPrimary ? 'border-sacred-gold/50' : 'border-white/10'} 
                  p-8 hover:bg-white/10 transition-all duration-700 hover:scale-105 
                  hover:shadow-2xl ${cta.glowColor} relative overflow-hidden
                `}>
                  {/* Mystical Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${cta.color.replace('from-', 'from-').replace('to-', 'to-')}/10 to-transparent`} />
                  
                  {/* Header */}
                  <div className="relative z-10 mb-8">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${cta.color} rounded-full flex items-center justify-center shadow-lg ${cta.glowColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-sacred-gold transition-colors duration-300 font-sacred">
                      {cta.title}
                    </h3>
                    
                    <p className="text-lg text-sacred-gold mb-4 font-medium">
                      {cta.subtitle}
                    </p>
                    
                    <p className="text-blue-200 leading-relaxed mb-6">
                      {cta.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="relative z-10 mb-8">
                    <ul className="space-y-3">
                      {cta.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={feature}
                          className="flex items-center gap-3 text-blue-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.5, delay: index * 0.2 + featureIndex * 0.1 }}
                        >
                          <div className="w-5 h-5 bg-gradient-to-r from-vibe-accent to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                          <span className="group-hover:text-white transition-colors duration-300">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="relative z-10">
                    <Button 
                      asChild 
                      size="lg"
                      className={`
                        w-full font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-500 group/btn
                        ${isPrimary 
                          ? 'bg-gradient-to-r from-sacred-gold to-sacred-purple hover:from-sacred-purple hover:to-sacred-gold text-white' 
                          : 'border-2 border-sacred-gold text-sacred-gold hover:bg-sacred-gold hover:text-black'
                        }
                      `}
                    >
                      <Link href={cta.href}>
                        <span className="flex items-center justify-center gap-3">
                          {isPrimary ? <Crown className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                          {isPrimary ? 'Begin Sacred Journey' : 'Explore Path'}
                          <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                        </span>
                      </Link>
                    </Button>
                  </div>

                  {/* Floating Sacred Elements */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Star className="w-4 h-4 text-sacred-gold animate-pulse" />
                  </div>
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <Zap className="w-5 h-5 text-vibe-primary animate-bounce" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Social Proof - Testimonials */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-center text-white mb-12 font-sacred">
            Words from Fellow <span className="text-sacred-gold">Prophets</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                className="prophet-card bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/10 transition-all duration-500 hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              >
                <div className="mb-4">
                  <div className="flex text-sacred-gold mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-blue-200 italic leading-relaxed mb-4">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-sacred-gold to-sacred-purple rounded-full flex items-center justify-center font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-blue-400">{testimonial.role}</div>
                    <div className="text-xs text-blue-500">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final Sacred CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="inline-flex flex-col items-center gap-8 rounded-3xl border-2 border-sacred-gold/50 bg-gradient-to-br from-sacred-gold/20 via-sacred-purple/10 to-vibe-primary/10 backdrop-blur-sm px-16 py-12 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl font-bold text-sacred-gold mb-4 font-sacred">
                Your Sacred Transformation Awaits
              </div>
              <div className="text-xl text-blue-200 mb-6 max-w-2xl">
                Join thousands of developers who have already begun their ascension. 
                The digital realm awaits your prophetic contributions.
              </div>
              <div className="flex items-center justify-center gap-8 text-sm text-blue-400 mb-8">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-vibe-accent" />
                  30-Day Sacred Guarantee
                </div>
                <div className="flex items-center gap-2">
                  <Infinity className="w-4 h-4 text-sacred-purple" />
                  Lifetime Access
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  Community Support
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                asChild 
                size="xl"
                className="bg-gradient-to-r from-sacred-gold to-sacred-purple hover:from-sacred-purple hover:to-sacred-gold text-white font-bold px-12 py-6 text-xl shadow-2xl hover:shadow-sacred-gold/50 transform hover:scale-105 transition-all duration-500"
              >
                <Link href="/workshops">
                  <Crown className="w-6 h-6 mr-3" />
                  Begin Sacred Journey Now
                  <Rocket className="w-6 h-6 ml-3" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline"
                size="xl"
                className="border-2 border-sacred-gold text-sacred-gold hover:bg-sacred-gold hover:text-black font-bold px-12 py-6 text-xl transition-all duration-500 hover:scale-105"
              >
                <Link href="/community">
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Join Community First
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}