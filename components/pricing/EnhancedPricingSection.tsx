'use client'

import { useState } from 'react'
import { Check, Zap, Crown, Sparkles, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { formatPrice, calculateYearlyDiscount } from '@/lib/stripe/server'
import { toast } from '@/hooks/use-toast'

interface PricingPlan {
  id: string
  name: string
  tier: string
  price: number
  priceYearly?: number
  priceLifetime?: number
  priceId: string
  priceIdYearly?: string
  priceIdLifetime?: string
  features: string[]
  popular?: boolean
  description: string
  buttonText: string
  maxUsers?: number
  currency: string
  vatIncluded: boolean
  discountYearly?: number
}

const plans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Seeker',
    tier: 'free',
    price: 0,
    priceId: '',
    currency: 'EUR',
    vatIncluded: true,
    description: 'Entdecke die Grundlagen des Vibe Coding',
    buttonText: 'Kostenlos starten',
    features: [
      'Zugang zu den ersten 2 Geboten',
      'Grundlegende Coding-Herausforderungen',
      'Community-Forum (nur lesen)',
      'Fortschritts-Tracking',
      'E-Mail-Support'
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    tier: 'starter',
    price: 1900,
    priceYearly: 19000,
    priceId: 'price_starter_monthly',
    priceIdYearly: 'price_starter_yearly',
    currency: 'EUR',
    vatIncluded: true,
    discountYearly: 16,
    description: 'Perfekt für individuelle Entwickler',
    buttonText: 'Starter werden',
    features: [
      'Zugang zu 5 Geboten',
      'Alle Coding-Herausforderungen',
      'Vollständiger Community-Zugang',
      'Fortschritts-Analytics',
      'E-Mail & Chat-Support',
      'Monaco Editor Playground',
      'Workshop-Materialien zum Download'
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tier: 'pro',
    price: 3900,
    priceYearly: 39000,
    priceId: 'price_pro_monthly',
    priceIdYearly: 'price_pro_yearly',
    currency: 'EUR',
    vatIncluded: true,
    popular: true,
    discountYearly: 16,
    description: 'Für ernsthafte Entwickler und kleine Teams',
    buttonText: 'Pro werden',
    features: [
      'Zugang zu 8 Geboten',
      'Erweiterte AI-Herausforderungen',
      'Echtzeit-Kollaborations-Tools',
      'Gruppen-Mentoring-Sessions',
      'Priority Support',
      'Projekt-Reviews',
      'Zertifikat nach Abschluss',
      'Früher Zugang zu neuen Inhalten'
    ],
  },
  {
    id: 'expert',
    name: 'Expert',
    tier: 'expert',
    price: 6900,
    priceYearly: 69000,
    priceId: 'price_expert_monthly',
    priceIdYearly: 'price_expert_yearly',
    currency: 'EUR',
    vatIncluded: true,
    discountYearly: 16,
    description: 'Komplette Meisterschaft für Teams und Unternehmen',
    buttonText: 'Expert werden',
    maxUsers: 5,
    features: [
      'Alle 10 heiligen Gebote',
      'Erweiterte AI-powered Herausforderungen',
      'Team-Kollaborations-Tools',
      'Persönliche 1-zu-1 Mentoring-Sessions',
      'VIP Support',
      'Custom Projekt-Reviews',
      'Zertifikat der Vollendung',
      'Revenue-Sharing Möglichkeiten',
      'White-Label-Optionen',
      'API-Zugang für Integrationen'
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime Access',
    tier: 'lifetime',
    price: 49700,
    priceLifetime: 49700,
    priceId: 'price_lifetime',
    priceIdLifetime: 'price_lifetime',
    currency: 'EUR',
    vatIncluded: true,
    description: 'Lebenslanger Zugang zu allem - beste Investition',
    buttonText: 'Lifetime kaufen',
    features: [
      'Alle 10 heiligen Gebote - für immer',
      'Lebenslange Updates und neue Inhalte',
      'Alle zukünftigen Features inklusive',
      'VIP Community-Zugang',
      'Persönliche Mentoring-Sessions',
      'Revenue-Sharing Berechtigung',
      'White-Label Lizenzrechte',
      'Prioritäts-Support',
      'Zertifizierung',
      'Keine wiederkehrenden Kosten'
    ],
  }
]

const tierIcons = {
  free: Zap,
  starter: Star,
  pro: Crown,
  expert: Sparkles,
  lifetime: Crown
}

const tierColors = {
  free: 'bg-slate-800/50 border-slate-600',
  starter: 'bg-blue-900/30 border-blue-500',
  pro: 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500',
  expert: 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500',
  lifetime: 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500'
}

export function EnhancedPricingSection() {
  const [isYearly, setIsYearly] = useState(false)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.tier === 'free') {
      // Handle free plan - just redirect to signup
      window.location.href = '/auth?mode=signup'
      return
    }

    setIsLoading(plan.id)
    
    try {
      let priceId = plan.priceId
      let isSubscription = true

      // Determine which price ID to use
      if (plan.tier === 'lifetime') {
        priceId = plan.priceIdLifetime || plan.priceId
        isSubscription = false
      } else if (isYearly && plan.priceIdYearly) {
        priceId = plan.priceIdYearly
      }

      // Get referral code from URL if present
      const urlParams = new URLSearchParams(window.location.search)
      const referralCode = urlParams.get('ref')

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planId: plan.id,
          isSubscription,
          referralCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error('Error creating checkout session:', error)
      toast({
        title: 'Fehler',
        description: 'Checkout-Session konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(null)
    }
  }

  const formatPlanPrice = (plan: PricingPlan) => {
    if (plan.tier === 'free') return 'Kostenlos'
    if (plan.tier === 'lifetime') return formatPrice(plan.price)
    
    const price = isYearly && plan.priceYearly ? plan.priceYearly : plan.price
    const period = isYearly ? 'Jahr' : 'Monat'
    return `${formatPrice(price)}/${period}`
  }

  const getDiscountBadge = (plan: PricingPlan) => {
    if (!isYearly || !plan.priceYearly || !plan.discountYearly) return null
    
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
        {plan.discountYearly}% sparen
      </Badge>
    )
  }

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">💎</div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4" style={{
            background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 50%, #FFCE00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Wähle deinen heiligen Pfad
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Transformiere deine Entwickler-Reise mit unserem tier-basierten Lernsystem. 
            Jeder Tier schaltet mehr Gebote und göttliche Kräfte frei.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Label htmlFor="billing-toggle" className={`text-slate-300 ${!isYearly ? 'font-semibold text-amber-400' : ''}`}>
              Monatlich
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label htmlFor="billing-toggle" className={`text-slate-300 ${isYearly ? 'font-semibold text-amber-400' : ''}`}>
              Jährlich
            </Label>
            <Badge variant="secondary" className="bg-green-900/50 text-green-300 border-green-500">
              16% sparen
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = tierIcons[plan.tier as keyof typeof tierIcons]
            
            return (
              <Card
                key={plan.id}
                className={`relative h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  tierColors[plan.tier as keyof typeof tierColors]
                } ${plan.popular ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 px-4 py-2 text-sm font-bold">
                      🏆 Beliebtester Plan
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      plan.tier === 'pro' ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20' : 
                      plan.tier === 'expert' ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' : 
                      plan.tier === 'lifetime' ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20' : 'bg-blue-500/20'
                    }`}>
                      <Icon className={`h-8 w-8 ${
                        plan.tier === 'pro' ? 'text-amber-400' : 
                        plan.tier === 'expert' ? 'text-purple-400' : 
                        plan.tier === 'lifetime' ? 'text-emerald-400' : 'text-blue-400'
                      }`} />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold mb-2 text-white">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-4 space-y-2">
                    <div className="text-3xl font-bold text-amber-400">
                      {formatPlanPrice(plan)}
                    </div>
                    {getDiscountBadge(plan)}
                    {plan.vatIncluded && plan.tier !== 'free' && (
                      <p className="text-sm text-slate-400">inkl. MwSt.</p>
                    )}
                  </div>
                  
                  <CardDescription className="text-sm text-slate-300">
                    {plan.description}
                  </CardDescription>
                  
                  {plan.maxUsers && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-300">bis zu {plan.maxUsers} Nutzer</span>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    disabled={isLoading === plan.id}
                    className={`w-full py-3 font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg'
                        : plan.tier === 'expert'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        : plan.tier === 'lifetime'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isLoading === plan.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Lädt...
                      </div>
                    ) : (
                      plan.buttonText
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Money-back guarantee */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 rounded-xl border border-green-500 bg-green-900/30 px-8 py-4 backdrop-blur-sm">
            <div className="text-2xl">✨</div>
            <div>
              <div className="text-lg font-bold text-green-300">
                30-Tage Geld-zurück-Garantie
              </div>
              <div className="text-sm text-green-400">
                Probiere jeden Plan risikofrei aus
              </div>
            </div>
          </div>
        </div>

        {/* Referral Info */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-sm text-slate-300">
            <span>💰</span>
            <span>
              Verdiene 15% Provision für jeden Referral - 
              <a href="/referrals" className="text-amber-400 hover:text-amber-300 hover:underline ml-1">
                Mehr erfahren
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}