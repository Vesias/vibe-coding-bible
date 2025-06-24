import { use } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, BookOpen, Star, Clock, Target, Users, Code, Zap } from 'lucide-react'

interface PageProps {
  params: Promise<{ commandment: string }>
}

export default function CommandmentPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const workshopId = resolvedParams.commandment

  // Valid workshop IDs and their data
  const validWorkshops = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']
  
  const workshopData: Record<string, any> = {
    'i': {
      title: 'Das Erste Gebot: Die Heilige Vision',
      subtitle: 'Foundation of Sacred Development',
      description: 'Master product conceptualization and market validation before touching any code. Learn to see the divine plan.',
      difficulty: 'Beginner',
      xp: 150,
      estimatedTime: 12,
      commandmentNumber: 'I'
    },
    'ii': {
      title: 'Das Zweite Gebot: Der Rechte Stack',
      subtitle: 'Choosing Sacred Technologies',
      description: 'Discover the art of selecting the perfect technology stack for your divine mission.',
      difficulty: 'Beginner',
      xp: 175,
      estimatedTime: 15,
      commandmentNumber: 'II'
    },
    'iii': {
      title: 'Das Dritte Gebot: Die Prompt-Kunst',
      subtitle: 'Mastering AI Communication',
      description: 'Learn to communicate with AI assistants like Claude Code with divine precision.',
      difficulty: 'Intermediate',
      xp: 200,
      estimatedTime: 18,
      commandmentNumber: 'III'
    }
  }
  
  if (!validWorkshops.includes(workshopId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <Card className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-red-500/30 p-8">
            <CardContent className="text-center space-y-4">
              <Crown className="h-16 w-16 text-red-400 mx-auto" />
              <h1 className="text-2xl font-bold text-white mb-4">Sacred Workshop Not Found</h1>
              <p className="text-blue-200 mb-6">
                The requested commandment "{workshopId}" does not exist in our sacred library.
              </p>
              <Button asChild className="bg-gradient-to-r from-sacred-gold/30 to-sacred-purple/30 hover:from-sacred-gold/50 hover:to-sacred-purple/50">
                <a href="/workshops">← Return to Sacred Workshops</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const workshop = workshopData[workshopId] || workshopData['i']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Workshop Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sacred-gold to-sacred-purple flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{workshop.commandmentNumber}</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white font-sacred mb-2">{workshop.title}</h1>
              <p className="text-xl text-blue-200">{workshop.subtitle}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Badge className="bg-gradient-to-r from-green-500/20 to-green-400/20 text-green-400 border-green-500/30">
              {workshop.difficulty}
            </Badge>
            <Badge className="bg-gradient-to-r from-sacred-gold/20 to-sacred-gold/20 text-sacred-gold border-sacred-gold/30">
              <Star className="w-4 h-4 mr-1" />
              {workshop.xp} XP
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500/20 to-blue-400/20 text-blue-400 border-blue-500/30">
              <Clock className="w-4 h-4 mr-1" />
              {workshop.estimatedTime} min
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-black/40 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-sacred-gold" />
                Workshop Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-blue-100 leading-relaxed">{workshop.description}</p>
              
              <div className="space-y-3">
                <h3 className="text-white font-semibold">What you'll learn:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-blue-100">
                    <div className="w-2 h-2 bg-sacred-gold rounded-full mt-2 flex-shrink-0"></div>
                    Sacred principles of AI-assisted development
                  </li>
                  <li className="flex items-start gap-2 text-blue-100">
                    <div className="w-2 h-2 bg-sacred-gold rounded-full mt-2 flex-shrink-0"></div>
                    Practical exercises with Claude Code
                  </li>
                  <li className="flex items-start gap-2 text-blue-100">
                    <div className="w-2 h-2 bg-sacred-gold rounded-full mt-2 flex-shrink-0"></div>
                    Divine wisdom through biblical metaphors
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Code className="w-6 h-6 text-sacred-purple" />
                Interactive Exercises
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-6xl mb-4">🏗️</div>
                <h3 className="text-xl font-semibold text-white mb-2">Workshop Coming Soon</h3>
                <p className="text-blue-200 mb-4">
                  This sacred workshop is being crafted with divine precision. 
                  Interactive lessons, AI mentor guidance, and practical exercises await.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sacred-gold">3</div>
                    <div className="text-sm text-blue-200">Exercises</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">1</div>
                    <div className="text-sm text-blue-200">AI Mentor</div>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-sacred-gold to-sacred-purple hover:from-sacred-gold/80 hover:to-sacred-purple/80">
                  <Zap className="w-4 h-4 mr-2" />
                  Begin Sacred Journey (Preview)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Button asChild variant="outline" className="border-white/20 text-blue-200 hover:bg-white/10">
            <a href="/workshops">
              ← All Sacred Workshops
            </a>
          </Button>
          
          <div className="flex gap-3">
            {workshopId !== 'i' && (
              <Button asChild variant="outline" className="border-white/20 text-blue-200 hover:bg-white/10">
                <a href={`/workshops/${validWorkshops[validWorkshops.indexOf(workshopId) - 1]}`}>
                  Previous
                </a>
              </Button>
            )}
            
            {workshopId !== 'x' && (
              <Button asChild className="bg-sacred-gold hover:bg-sacred-gold/80">
                <a href={`/workshops/${validWorkshops[validWorkshops.indexOf(workshopId) + 1]}`}>
                  Next Workshop
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Export metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params
  const workshopId = resolvedParams.commandment
  
  const workshopTitles: Record<string, string> = {
    'i': 'Die Heilige Vision - Sacred Foundation of AI Development',
    'ii': 'Der Rechte Stack - Choosing Sacred Technologies',
    'iii': 'Die Prompt-Kunst - Mastering AI Communication',
    'iv': 'Multi-Context Programming - Advanced AI Workflows',
    'v': 'Die Heilige Iteration - Continuous Divine Improvement',
    'vi': 'Göttliches Debugging - Sacred Problem Solving',
    'vii': 'Kunst des Vertrauens - Trust in AI Partnerships',
    'viii': 'Skalierungsstufen - Scaling Divine Applications',
    'ix': 'Zusammenarbeit Propheten - Collaborative Development',
    'x': 'Monetarisierung - Sacred Business Models'
  }
  
  const title = workshopTitles[workshopId] || 'Sacred Workshop'
  
  return {
    title: `${title} | Vibe Coding Bible`,
    description: `Master the sacred art of AI-assisted development with Commandment ${workshopId.toUpperCase()}. Interactive lessons, divine exercises, and AI mentor guidance.`,
    keywords: ['AI development', 'Vibe Coding', 'Programming', 'Claude Code', 'Interactive Workshop'],
  }
}