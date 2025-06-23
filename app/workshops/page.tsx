import fs from 'fs'
import path from 'path'

function getCommandmentContent(id: string) {
  try {
    const filePath = path.join(process.cwd(), 'content', `commandment-${id}.md`)
    const content = fs.readFileSync(filePath, 'utf8')
    
    // Extract title from first heading
    const titleMatch = content.match(/^# (.+)$/m)
    const title = titleMatch ? titleMatch[1] : `Commandment ${id.toUpperCase()}`
    
    // Extract description from content (first paragraph after title)
    const lines = content.split('\n')
    let description = 'Sacred wisdom for AI-assisted development'
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# ')) {
        // Found title, look for next non-empty line that's not a heading
        for (let j = i + 1; j < lines.length; j++) {
          const line = lines[j].trim()
          if (line && !line.startsWith('#') && !line.startsWith('**') && line.length > 20) {
            description = line.replace(/[*_]/g, '').slice(0, 150) + '...'
            break
          }
        }
        break
      }
    }
    
    return {
      id,
      title,
      description,
      content: content.slice(0, 1000) + '...', // Preview
      wordCount: content.split(' ').length,
      readTime: Math.ceil(content.split(' ').length / 200) // Assuming 200 words per minute
    }
  } catch (error) {
    return {
      id,
      title: `Commandment ${id.toUpperCase()}`,
      description: 'Sacred wisdom for AI-assisted development',
      content: 'Content loading...',
      wordCount: 0,
      readTime: 0
    }
  }
}

export default function WorkshopsPage() {
  const commandments = [
    'i-die-heilige-vision',
    'ii-der-rechte-stack', 
    'iii-die-prompt-kunst',
    'iv-multi-context-programming',
    'v-die-heilige-iteration',
    'vi-goettliches-debugging',
    'vii-kunst-des-vertrauens',
    'viii-skalierungsstufen',
    'ix-zusammenarbeit-propheten',
    'x-monetarisierung'
  ].map(getCommandmentContent)

  const totalWords = commandments.reduce((sum, cmd) => sum + cmd.wordCount, 0)
  const totalReadTime = commandments.reduce((sum, cmd) => sum + cmd.readTime, 0)

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
                <div className="text-3xl font-bold text-yellow-400">{totalWords.toLocaleString()}</div>
                <div className="text-sm text-blue-300">Words of Wisdom</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{totalReadTime}</div>
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
          {commandments.map((commandment, index) => (
            <div
              key={commandment.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {index + 1}
                </div>
                <div className="text-3xl">
                  {['👁️', '🏗️', '🧠', '💻', '🔄', '🐛', '🛡️', '📈', '👥', '💰'][index]}
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
                  📖 {commandment.wordCount.toLocaleString()} words
                </div>
                <div className="flex items-center gap-1">
                  ⏱️ {commandment.readTime} min read
                </div>
              </div>
              
              {/* Content Preview */}
              <div className="bg-black/30 rounded-lg p-4 mb-6">
                <h4 className="text-yellow-400 font-semibold mb-3 text-sm">Sacred Content Preview:</h4>
                <div className="text-gray-300 text-xs leading-relaxed max-h-32 overflow-hidden">
                  <pre className="whitespace-pre-wrap font-sans">{commandment.content}</pre>
                </div>
                <div className="mt-2 text-yellow-400 text-xs">...and much more divine wisdom awaits</div>
              </div>
              
              {/* Difficulty & XP */}
              <div className="flex items-center justify-between mb-6">
                <span className={`text-xs px-3 py-1 rounded-full ${
                  index < 3 ? 'bg-green-500/20 text-green-400' :
                  index < 7 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {index < 3 ? 'Beginner' : index < 7 ? 'Intermediate' : 'Advanced'}
                </span>
                <div className="text-blue-300 text-xs font-semibold">
                  {(index + 1) * 150} XP
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

      {/* Testimonials */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Voices of the <span className="text-yellow-400">Enlightened</span>
            </h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-blue-200 mb-6 italic">
                "The Vibe Coding Bible transformed my development approach completely. I went from struggling with basic coding to building full SaaS applications using AI in just 30 days."
              </p>
              <div className="text-white font-semibold">- Sarah M., Startup Founder</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-blue-200 mb-6 italic">
                "Biblical storytelling meets cutting-edge AI development. This isn't just learning to code - it's a spiritual journey into the future of software development."
              </p>
              <div className="text-white font-semibold">- Marcus K., Senior Developer</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-blue-200 mb-6 italic">
                "I've been coding for 10 years, but the Vibe Coding commandments taught me to work with AI in ways I never imagined. My productivity increased 8x."
              </p>
              <div className="text-white font-semibold">- Alex R., Tech Lead</div>
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