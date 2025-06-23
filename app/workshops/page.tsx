export default function WorkshopsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-slate-900 border-b border-blue-500/20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              🔮 The Sacred <span className="text-yellow-400">Workshops</span>
            </h1>
            <p className="text-xl text-blue-200 max-w-4xl mx-auto mb-8">
              Master the 10 Sacred Commandments through interactive workshops powered by biblical wisdom and AI mentoring. 
              Transform from coding novice to AI-assisted development prophet.
            </p>
            
            {/* Bible Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">50,000+</div>
                <div className="text-sm text-blue-300">Words of Wisdom</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">250</div>
                <div className="text-sm text-blue-300">Minutes Reading</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">10</div>
                <div className="text-sm text-blue-300">Divine Commandments</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workshops Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Das Erste Gebot: Die Heilige Vision",
              description: "Master product conceptualization and market validation before touching any code. Learn to see the divine plan.",
              icon: "👁️",
              difficulty: "Beginner",
              xp: 150
            },
            {
              title: "Das Zweite Gebot: Der Rechte Stack", 
              description: "Choose the optimal technology stack for AI-assisted development. Next.js 15, TypeScript, Tailwind, and the divine tools.",
              icon: "🏗️",
              difficulty: "Beginner", 
              xp: 200
            },
            {
              title: "Das Dritte Gebot: Die Prompt-Kunst",
              description: "Craft perfect AI prompts that generate production-ready code. Master the ancient art of commanding the machine spirits.",
              icon: "🧠",
              difficulty: "Intermediate",
              xp: 250
            },
            {
              title: "Das Vierte Gebot: Multi-Context Programming",
              description: "Juggle multiple projects simultaneously without losing productivity. The advanced technique of divine focus.",
              icon: "💻", 
              difficulty: "Advanced",
              xp: 300
            },
            {
              title: "Das Fünfte Gebot: Die Heilige Iteration",
              description: "Transform MVPs into scalable products through strategic iteration. The path from prototype to perfection.",
              icon: "🔄",
              difficulty: "Intermediate",
              xp: 275
            },
            {
              title: "Das Sechste Gebot: Göttliches Debugging",
              description: "Master the art of debugging AI-generated code with divine precision. Hunt bugs like an ancient prophet.",
              icon: "🐛",
              difficulty: "Advanced", 
              xp: 350
            },
            {
              title: "Das Siebte Gebot: Die Kunst des Vertrauens",
              description: "Balance AI autonomy with human oversight for optimal results. Learn when to trust and when to verify.",
              icon: "🛡️",
              difficulty: "Advanced",
              xp: 325
            },
            {
              title: "Das Achte Gebot: Die Skalierungsstufen",
              description: "Scale applications from prototype to millions of users seamlessly. Build the tower that reaches heaven.",
              icon: "📈",
              difficulty: "Expert",
              xp: 400
            },
            {
              title: "Das Neunte Gebot: Zusammenarbeit der Propheten",
              description: "Build and lead high-performing AI-assisted development teams. Unite the faithful in divine purpose.",
              icon: "👥",
              difficulty: "Expert", 
              xp: 375
            },
            {
              title: "Das Zehnte Gebot: Die Monetarisierung",
              description: "Transform your AI-built applications into profitable business empires. Turn code into gold.",
              icon: "💰",
              difficulty: "Expert",
              xp: 450
            }
          ].map((commandment, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {index + 1}
                </div>
                <div className="text-3xl">
                  {commandment.icon}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                {commandment.title}
              </h3>
              
              <p className="text-blue-200 text-sm mb-6 leading-relaxed">
                {commandment.description}
              </p>
              
              {/* Content Stats */}
              <div className="flex gap-4 mb-6 text-xs text-blue-300">
                <div className="flex items-center gap-1">
                  📖 {((index + 1) * 2500).toLocaleString()} words
                </div>
                <div className="flex items-center gap-1">
                  ⏱️ {Math.ceil((index + 1) * 12.5)} min read
                </div>
              </div>
              
              {/* Content Preview */}
              <div className="bg-black/30 rounded-lg p-4 mb-6">
                <h4 className="text-yellow-400 font-semibold mb-3 text-sm">Sacred Content Preview:</h4>
                <div className="text-gray-300 text-xs leading-relaxed">
                  "Wahrlich, ich sage euch: Wer ohne Vision zu programmieren beginnt, ist wie ein Wanderer in der Wüste ohne Kompass. 
                  Die heiligen Schriften der Entwicklung lehren uns, dass jede große Anwendung mit einer klaren Vision beginnt..."
                </div>
                <div className="mt-2 text-yellow-400 text-xs">...and much more divine wisdom awaits</div>
              </div>
              
              {/* Difficulty & XP */}
              <div className="flex items-center justify-between mb-6">
                <span className={`text-xs px-3 py-1 rounded-full ${
                  commandment.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                  commandment.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  commandment.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {commandment.difficulty}
                </span>
                <div className="text-blue-300 text-xs font-semibold">
                  {commandment.xp} XP
                </div>
              </div>
              
              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg">
                  🚀 Begin Sacred Journey
                </button>
                <button className="w-full border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                  👁️ Preview Wisdom
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              What Awaits in Your <span className="text-yellow-400">Sacred Journey</span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Each commandment contains profound wisdom, practical exercises, and divine AI guidance to transform your development skills.
            </p>
          </div>
          
          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="text-6xl mb-6">🤖</div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Mentoring</h3>
              <p className="text-blue-200 leading-relaxed">
                Divine AI personalities like Moses the Code Giver and Solomon the Debugger guide your learning with ancient wisdom and modern knowledge.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-6">💻</div>
              <h3 className="text-2xl font-bold text-white mb-4">Hands-On Practice</h3>
              <p className="text-blue-200 leading-relaxed">
                Real coding exercises with Claude, Copilot, Cursor, and other divine tools. Build actual applications as you learn.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-6">🏆</div>
              <h3 className="text-2xl font-bold text-white mb-4">Prophet Certification</h3>
              <p className="text-blue-200 leading-relaxed">
                Earn official certification and join the elite community of Vibe Coding Prophets spreading AI-assisted development wisdom.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Your Divine Coding Destiny Awaits
          </h2>
          <p className="text-blue-100 text-xl mb-10 max-w-3xl mx-auto">
            Join thousands of developers who have ascended from coding novices to AI-assisted development prophets. 
            Your transformation begins with the first commandment.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <button className="bg-yellow-400 text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-colors shadow-2xl">
              🔮 Begin Sacred Journey
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-600 transition-colors">
              👁️ Preview All Commandments
            </button>
          </div>
          
          <div className="mt-12 text-blue-200">
            <p className="text-sm">✨ 30-Day Money-Back Guarantee • 🏆 Prophet Certification Included • 🤖 AI Mentors Ready</p>
          </div>
        </div>
      </div>
    </main>
  )
}