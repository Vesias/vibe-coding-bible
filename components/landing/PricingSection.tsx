export function PricingSection() {
  const plans = [
    {
      name: 'Seeker',
      tier: 'seeker',
      price: 0,
      period: 'month',
      description: 'Start your journey with the fundamental commandments',
      features: [
        'Access to 2 Commandments',
        '50 AI interactions/month',
        'Community access',
        'Basic workshop materials',
        'Email support'
      ],
      popular: false,
      cta: 'Start Free'
    },
    {
      name: 'Apostle',
      tier: 'apostle',
      price: 29,
      period: 'month',
      description: 'Master the core principles of Vibe Coding',
      features: [
        'Access to 5 Commandments',
        '500 AI interactions/month',
        'Code review assistance',
        'Advanced workshops',
        'Priority email support',
        'Mentorship matching'
      ],
      popular: true,
      cta: 'Become Apostle'
    },
    {
      name: 'Prophet',
      tier: 'prophet',
      price: 79,
      period: 'month',
      description: 'Advanced mastery for serious developers',
      features: [
        'Access to 8 Commandments',
        '2000 AI interactions/month',
        'Team collaboration tools',
        'Priority support',
        'Live workshops',
        '1-on-1 mentoring sessions'
      ],
      popular: false,
      cta: 'Become Prophet'
    },
    {
      name: 'Divine',
      tier: 'divine',
      price: 199,
      period: 'month',
      description: 'Ultimate mastery and certification',
      features: [
        'All 10 Commandments',
        'Unlimited AI interactions',
        'Certification program',
        '24/7 priority support',
        'Exclusive community',
        'Personal AI mentor',
        'Business consultation'
      ],
      popular: false,
      cta: 'Ascend to Divine'
    }
  ]

  return (
    <section className="py-24 bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white">
            Choose Your <span className="text-yellow-400 font-bold">Sacred Path</span>
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Transform your development journey with our tier-based learning system. 
            Each tier unlocks more commandments and divine powers.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <div
              key={plan.tier}
              className={`relative h-full bg-white/10 backdrop-blur-sm rounded-xl border ${
                plan.popular 
                  ? 'border-yellow-400 bg-yellow-400/5' 
                  : 'border-white/20'
              } p-8 hover:bg-white/20 transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-blue-200">/{plan.period}</span>
                </div>
                <p className="text-blue-200 text-sm">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <div className="text-green-400 mr-3 mt-1">✓</div>
                    <span className="text-blue-100 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : 'border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 rounded-xl border border-green-400/30 bg-green-400/10 px-6 py-4">
            <div className="text-lg font-bold text-green-400">
              ✨ 30-Day Money-Back Guarantee
            </div>
            <div className="text-sm text-blue-300">
              Try any plan risk-free
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}