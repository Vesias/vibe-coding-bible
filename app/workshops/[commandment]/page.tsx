import { use } from 'react'
import { SacredInteractiveWorkshop } from '@/components/workshop/SacredInteractiveWorkshop'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown } from 'lucide-react'
import { motion } from 'framer-motion'

interface PageProps {
  params: Promise<{ commandment: string }>
}

export default function CommandmentPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const workshopId = resolvedParams.commandment

  // Valid workshop IDs
  const validWorkshops = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']
  
  if (!validWorkshops.includes(workshopId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
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
        </motion.div>
      </div>
    )
  }

  return (
    <SacredInteractiveWorkshop 
      workshopId={workshopId}
      className="min-h-screen"
    />
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