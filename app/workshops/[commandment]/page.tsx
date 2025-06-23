'use client'

import { use } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/ui/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  PlayCircle, 
  Trophy, 
  Clock, 
  Users, 
  Code,
  Target,
  Star,
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'

const commandments = [
  {
    id: 'i',
    title: 'I. Die Heilige Vision',
    subtitle: 'The Sacred Foundation of AI-Assisted Development',
    difficulty: 'Beginner',
    xp: 100,
    duration: '45 min',
    description: 'Learn to see beyond traditional coding - embrace the divine vision of AI-assisted development.',
    content: `# Die Heilige Vision: Der Grundstein des AI-Assisted Development

## Was ist die Heilige Vision?

Die Heilige Vision ist die fundamentale Erkenntnis, dass Softwareentwicklung nicht länger ein manueller, zeitaufwändiger Prozess sein muss. Es ist die Offenbarung, dass KI-Assistenten wie Claude Code, GitHub Copilot und Cursor nicht nur Werkzeuge sind - sie sind deine digitalen Partner auf dem Weg zur Entwicklungserleuchtung.

## Die Vier Säulen der Vision

### 1. 🤖 Partnership über Tools
Sieh AI nicht als Werkzeug, sondern als intelligenten Partner. Ein echter Prophet des Vibe Codings arbeitet MIT der AI, nicht nur mit ihr.

### 2. 🎯 Intention vor Implementation  
Bevor du eine Zeile Code schreibst, visualisiere das Endergebnis. Die Vision kommt vor der Ausführung.

### 3. ⚡ Effizienz durch Vertrauen
Lerne der AI zu vertrauen, aber verify always. Smart delegation ist der Schlüssel.

### 4. 🔮 Kontinuierliche Evolution
Deine Vision entwickelt sich mit jedem Projekt weiter. Bleibe offen für neue Paradigmen.

## Praktische Übung: Deine erste Vision

1. **Öffne Claude Code** und beschreibe dein nächstes Projekt in natürlicher Sprache
2. **Lass die AI** den Projektplan erstellen
3. **Iteriere gemeinsam** bis die Vision kristallklar ist
4. **Dokumentiere** deine Erkenntnisse

## Coding Übung

\`\`\`typescript
// Statt zu schreiben:
function calculateUserAge(birthDate: Date): number {
  // Complex manual calculation
}

// Frage die AI:
// "Create a robust age calculation function with edge cases"
// Und lass sie die Implementation übernehmen
\`\`\`

## Erfolgsmetriken

- ✅ Du denkst in Lösungen, nicht in Code
- ✅ Du kommunizierst effektiv mit AI-Assistenten  
- ✅ Du siehst das große Bild vor den Details
- ✅ Du vertraust der AI bei repetitiven Tasks

## Nächste Schritte

Nach der Heiligen Vision folgt "Der Rechte Stack" - die Auswahl der göttlichen Technologien für deine Mission.`,
    exercises: [
      'Beschreibe dein Traumprojekt in 3 Sätzen',
      'Lass Claude Code einen Projektplan erstellen',
      'Identifiziere 5 Bereiche für AI-Unterstützung'
    ],
    mentor: 'Moses the Code Giver'
  },
  {
    id: 'ii',
    title: 'II. Der Rechte Stack',
    subtitle: 'Choosing Your Sacred Technologies',
    difficulty: 'Beginner',
    xp: 120,
    duration: '50 min',
    description: 'Master the art of selecting the perfect technology stack for divine development.',
    content: `# Der Rechte Stack: Die Wahl der heiligen Technologien

## Die Stack-Offenbarung

Nicht alle Technologien sind gleich geschaffen. Der Rechte Stack ist die harmonische Kombination von Tools, die perfekt mit AI-Assistenten zusammenarbeiten und maximale Produktivität ermöglichen.

## Die Heilige Trinität der Moderne

### Frontend: Next.js + React + TypeScript
- **Next.js 15**: Das Fundament für Server-Side Rendering und App Router
- **React**: Komponentenbasierte UI-Entwicklung 
- **TypeScript**: Type Safety für bessere AI-Unterstützung

### Backend: Serverless + Edge Functions
- **Vercel Functions**: Automatische Skalierung
- **Supabase**: Database + Auth + Realtime
- **Stripe**: Payment Processing

### AI Integration Layer
- **Claude Code**: Primärer Coding Assistant
- **GitHub Copilot**: Code Completion
- **Cursor**: AI-First IDE

## Stack-Auswahl Prinzipien

### 1. AI-Freundlichkeit
Wähle Technologien, die AI-Assistenten gut verstehen:
- Populäre Frameworks mit großen Datasets
- Standardisierte Patterns und Conventions
- Gute Dokumentation für AI Training

### 2. Developer Experience
- Hot Reload und Fast Refresh
- Integrierte TypeScript Unterstützung  
- Excellente VSCode Integration

### 3. Deployment Einfachheit
- One-Click Deployments
- Automatische CI/CD Pipelines
- Environment Management

## Praktisches Beispiel: SaaS Stack

\`\`\`bash
# Das perfekte Setup
npx create-next-app@latest my-saas --typescript --tailwind --app
cd my-saas
npm install @supabase/supabase-js stripe framer-motion
\`\`\`

## Anti-Patterns vermeiden

❌ **Legacy Stacks**: jQuery, PHP ohne Framework
❌ **Over-Engineering**: Komplexe Microservices für MVPs  
❌ **AI-Unfriendly**: Obscure oder neue Frameworks
❌ **Vendor Lock-in**: Proprietäre Systeme ohne Escape-Hatch

## Stack Validation

Teste deinen Stack mit der "AI First Rule":
1. Kann Claude Code damit arbeiten?
2. Verstehen GitHub Copilot die Patterns?
3. Ist die Dokumentation AI-lesbar?

Wenn alle drei "Ja" sind - du hast den rechten Stack gefunden! 🎯`,
    exercises: [
      'Setup eines Next.js + Supabase Projekts',
      'Integration von Claude Code in deinen Workflow',
      'Deployment auf Vercel mit einer Zeile'
    ],
    mentor: 'Solomon the Debugger'
  }
]

interface PageProps {
  params: Promise<{ commandment: string }>
}

export default function CommandmentPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const commandmentData = commandments.find(c => c.id === resolvedParams.commandment)

  if (!commandmentData) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Commandment not found</h1>
          <Button asChild>
            <a href="/workshops">← Back to Workshops</a>
          </Button>
        </div>
      </AppLayout>
    )
  }

  const currentIndex = commandments.findIndex(c => c.id === resolvedParams.commandment)
  const prevCommandment = currentIndex > 0 ? commandments[currentIndex - 1] : null
  const nextCommandment = currentIndex < commandments.length - 1 ? commandments[currentIndex + 1] : null

  return (
    <AppLayout>
      <PageHeader
        title={commandmentData.title}
        description={commandmentData.subtitle}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Workshops', href: '/workshops' },
          { label: commandmentData.title }
        ]}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Progress & Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{commandmentData.xp}</div>
              <div className="text-sm text-gray-600">XP Reward</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Badge className="mb-2">{commandmentData.difficulty}</Badge>
              <div className="text-sm text-gray-600">Difficulty</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-gray-900 mb-1">
                <Clock className="h-4 w-4" />
                {commandmentData.duration}
              </div>
              <div className="text-sm text-gray-600">Duration</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-gray-900 mb-1">
                <Users className="h-4 w-4" />
                AI Mentor
              </div>
              <div className="text-sm text-gray-600">{commandmentData.mentor}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="exercises" className="gap-2">
                  <Code className="h-4 w-4" />
                  Exercises
                </TabsTrigger>
                <TabsTrigger value="mentor" className="gap-2">
                  <Users className="h-4 w-4" />
                  AI Mentor
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="prose prose-slate max-w-none">
                      {commandmentData.content.split('\n').map((line, index) => {
                        if (line.startsWith('# ')) {
                          return <h1 key={index} className="text-3xl font-bold mb-6 text-gray-900">{line.slice(2)}</h1>
                        } else if (line.startsWith('## ')) {
                          return <h2 key={index} className="text-2xl font-semibold mb-4 text-gray-800 mt-8">{line.slice(3)}</h2>
                        } else if (line.startsWith('### ')) {
                          return <h3 key={index} className="text-xl font-semibold mb-3 text-gray-800 mt-6">{line.slice(4)}</h3>
                        } else if (line.startsWith('```')) {
                          return <div key={index} className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto my-4">
                            <code>{line.slice(3)}</code>
                          </div>
                        } else if (line.trim()) {
                          return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{line}</p>
                        }
                        return <br key={index} />
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exercises" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Hands-on Exercises
                    </CardTitle>
                    <CardDescription>
                      Complete these exercises to master the commandment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {commandmentData.exercises.map((exercise, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold mt-1">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-2">{exercise}</p>
                            <Button size="sm" variant="outline">
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Start Exercise
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mentor" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      AI Mentor: {commandmentData.mentor}
                    </CardTitle>
                    <CardDescription>
                      Get personalized guidance from your AI mentor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{commandmentData.mentor}</h3>
                      <p className="text-gray-600 mb-6">
                        Your personal AI mentor is ready to guide you through this commandment
                      </p>
                      <Button className="bg-gradient-to-r from-purple-500 to-blue-600">
                        <Users className="h-4 w-4 mr-2" />
                        Start AI Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Completion</span>
                      <span>25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-xs text-gray-600">XP Earned</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">0/3</div>
                      <div className="text-xs text-gray-600">Exercises</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Complete
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Star className="h-4 w-4 mr-2" />
                  Add to Favorites
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Join Study Group
                </Button>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex gap-3">
              {prevCommandment && (
                <Button asChild variant="outline" className="flex-1">
                  <a href={`/workshops/${prevCommandment.id}`} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </a>
                </Button>
              )}
              {nextCommandment && (
                <Button asChild className="flex-1">
                  <a href={`/workshops/${nextCommandment.id}`} className="flex items-center gap-2">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}