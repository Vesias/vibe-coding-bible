export function CommandmentsPreview() {
  const commandments = [
    {
      number: 'I',
      title: 'Die Heilige Vision',
      description: 'Master product conceptualization and market validation before touching any code.',
      icon: '👁️',
      difficulty: 'Beginner',
      xp: 150
    },
    {
      number: 'II',
      title: 'Der Rechte Stack',
      description: 'Choose the optimal technology stack for AI-assisted development success.',
      icon: '🏗️',
      difficulty: 'Beginner',
      xp: 200
    },
    {
      number: 'III',
      title: 'Die Prompt-Kunst',
      description: 'Craft perfect AI prompts that generate production-ready code every time.',
      icon: '🧠',
      difficulty: 'Intermediate',
      xp: 250
    },
    {
      number: 'IV',
      title: 'Multi-Context Programming',
      description: 'Juggle multiple projects simultaneously without losing productivity.',
      icon: '💻',
      difficulty: 'Advanced',
      xp: 300
    },
    {
      number: 'V',
      title: 'Die Heilige Iteration',
      description: 'Transform MVPs into scalable products through strategic iteration.',
      icon: '🔄',
      difficulty: 'Intermediate',
      xp: 275
    },
    {
      number: 'VI',
      title: 'Göttliches Debugging',
      description: 'Master the art of debugging AI-generated code with divine precision.',
      icon: '🐛',
      difficulty: 'Advanced',
      xp: 350
    },
    {
      number: 'VII',
      title: 'Die Kunst des Vertrauens',
      description: 'Balance AI autonomy with human oversight for optimal results.',
      icon: '🛡️',
      difficulty: 'Advanced',
      xp: 325
    },
    {
      number: 'VIII',
      title: 'Die Skalierungsstufen',
      description: 'Scale applications from prototype to millions of users seamlessly.',
      icon: '📈',
      difficulty: 'Expert',
      xp: 400
    },
    {
      number: 'IX',
      title: 'Zusammenarbeit der Propheten',
      description: 'Build and lead high-performing AI-assisted development teams.',
      icon: '👥',
      difficulty: 'Expert',
      xp: 375
    },
    {
      number: 'X',
      title: 'Die Monetarisierung',
      description: 'Transform your AI-built applications into profitable business empires.',
      icon: '💰',
      difficulty: 'Expert',
      xp: 450
    }
  ]

  return (
    <section className="py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white">
            The <span className="text-yellow-400 font-bold">10 Sacred Commandments</span>
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Each commandment is a comprehensive workshop combining theory, practice, and real-world application. 
            Master them all to become a certified Vibe Coding Prophet.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {commandments.map((commandment, index) => (
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
              
              <p className="text-sm leading-relaxed text-blue-200 mb-4">
                {commandment.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  commandment.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                  commandment.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  commandment.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {commandment.difficulty}
                </span>
                <div className="text-xs text-blue-300">
                  {commandment.xp} XP
                </div>
              </div>

              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 w-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-6 py-4">
            <div className="text-2xl font-bold text-yellow-400">
              Total XP Available: 3,075
            </div>
            <div className="text-sm text-blue-300">
              Complete all commandments to reach Prophet status
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}