export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">      
        <div className="container relative z-10 mx-auto px-4 py-16 text-center">
          <div className="mx-auto max-w-4xl">
            {/* VibeCoding Bible Logo */}
            <div className="flex justify-center mb-8">
              <div className="text-6xl">📜</div>
            </div>

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
              <a href="/workshops" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl transition-all duration-300 inline-block">
                Begin Your Prophecy →
              </a>
              
              <a href="/preview" className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 text-lg rounded-full transition-all duration-300 inline-block">
                Preview the Bible
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-2xl font-bold text-white">10+</div>
                <div className="text-sm text-blue-300">AI Tools Mastered</div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-2xl font-bold text-white">8x</div>
                <div className="text-sm text-blue-300">Development Speed</div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-sm text-blue-300">Success Rate</div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-2xl font-bold text-white">2.5K+</div>
                <div className="text-sm text-blue-300">Active Prophets</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commandments Preview */}
      <div className="py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white">
              The <span className="text-yellow-400 font-bold">10 Sacred Commandments</span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Each commandment is a comprehensive workshop combining theory, practice, and real-world application.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[
              { number: 'I', title: 'Die Heilige Vision', icon: '👁️' },
              { number: 'II', title: 'Der Rechte Stack', icon: '🏗️' },
              { number: 'III', title: 'Die Prompt-Kunst', icon: '🧠' },
              { number: 'IV', title: 'Multi-Context Programming', icon: '💻' },
              { number: 'V', title: 'Die Heilige Iteration', icon: '🔄' },
              { number: 'VI', title: 'Göttliches Debugging', icon: '🐛' },
              { number: 'VII', title: 'Die Kunst des Vertrauens', icon: '🛡️' },
              { number: 'VIII', title: 'Die Skalierungsstufen', icon: '📈' },
              { number: 'IX', title: 'Zusammenarbeit der Propheten', icon: '👥' },
              { number: 'X', title: 'Die Monetarisierung', icon: '💰' }
            ].map((commandment) => (
              <div
                key={commandment.number}
                className="h-full bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {commandment.number}
                  </div>
                  <div className="text-2xl">{commandment.icon}</div>
                </div>
                
                <h3 className="text-lg font-semibold leading-tight text-white mb-3">
                  {commandment.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">🔮 Die Vibe Coding Bibel</h3>
          <p className="text-slate-300 mb-4">Master AI-Assisted Development with the 10 Sacred Commandments</p>
          <p className="text-sm text-slate-400">© 2025 vibecodingbible.agentland.saarland - All rights reserved</p>
        </div>
      </footer>
    </main>
  )
}