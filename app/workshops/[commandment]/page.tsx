import { getWorkshopById } from '@/lib/workshop/workshop-content-migrated'
import SacredWorkshopEngine from '@/components/workshop/SacredWorkshopEngine'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown } from 'lucide-react'

interface PageProps {
  params: Promise<{ commandment: string }>
}

export default async function CommandmentPage({ params }: PageProps) {
  const resolvedParams = await params
  const workshopId = resolvedParams.commandment.toLowerCase()

  const workshop = getWorkshopById(workshopId)
  
  if (!workshop) {
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
              <Button asChild className="bg-gradient-to-r from-yellow-500/30 to-purple-600/30 hover:from-yellow-500/50 hover:to-purple-600/50">
                <a href="/workshops">← Return to Sacred Workshops</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <SacredWorkshopEngine workshop={workshop} />
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
