import Link from 'next/link'

export function HeroSection() {
  const stats = [
    { label: 'AI Tools Mastered', value: '10+' },
    { label: 'Development Speed', value: '8x' },
    { label: 'Success Rate', value: '95%' },
    { label: 'Active Prophets', value: '2.5K+' },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">      
      <div className="container relative z-10 mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-medium text-yellow-400 mb-6">
            ⚡ Transform Your Development in 30 Days
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
            Master the{' '}
            <span className="text-yellow-400 font-bold">
              10 Sacred Commandments
            </span>{' '}
            of Vibe Coding
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-200 sm:text-xl">
            Transform from coding novice to AI-assisted development prophet. 
            Build production-ready SaaS applications without writing a single line of code manually.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6 mb-12">
            <Link href="/workshops" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl transition-all duration-300 inline-block">
              Begin Your Prophecy →
            </Link>
            
            <Link href="/preview" className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 text-lg rounded-full transition-all duration-300 inline-block">
              Preview the Bible
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="flex flex-col items-center space-y-2">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-blue-300">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-col items-center space-y-4">
            <p className="text-sm text-blue-300">
              Trusted by developers at
            </p>
            <div className="flex items-center space-x-8 opacity-60">
              <div className="h-8 w-24 bg-white/20 rounded" />
              <div className="h-8 w-24 bg-white/20 rounded" />
              <div className="h-8 w-24 bg-white/20 rounded" />
              <div className="h-8 w-24 bg-white/20 rounded" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}