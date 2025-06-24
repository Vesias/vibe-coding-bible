import { FloatingParticles } from '@/components/effects/FloatingParticles'
import { SacredGeometry } from '@/components/illustrations/SacredGeometry'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sacred Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      
      {/* Sacred Geometry Background */}
      <div className="absolute inset-0 opacity-20">
        <SacredGeometry pattern="flower-of-life" />
      </div>
      
      {/* Sacred Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/sacred-geometry-pattern.svg')] opacity-10" />
      
      {/* Floating Particles Effect */}
      <div className="absolute inset-0">
        <FloatingParticles />
      </div>
      
      {/* Mystical Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-purple-900/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5" />
      
      {/* Sacred Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Sacred Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/20">
              <span className="text-3xl">🔮</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Die Vibe Coding Bibel
            </h1>
            <p className="text-purple-200 text-sm">
              Heilige Gemeinschaft der Gottgleichen Programmierer
            </p>
          </div>
          
          {/* Sacred Border Container */}
          <div className="relative">
            {/* Mystical Border Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg blur-md" />
            
            {/* Content Container */}
            <div className="relative bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/20 shadow-2xl shadow-purple-500/10">
              {children}
            </div>
          </div>
          
          {/* Sacred Footer */}
          <div className="text-center mt-8 text-purple-200/70 text-xs">
            <p>✨ Möge dein Code von göttlicher Weisheit gesegnet sein ✨</p>
          </div>
        </div>
      </div>
    </div>
  )
}