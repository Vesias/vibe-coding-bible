'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Brain, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  Code, 
  BookOpen, 
  Target,
  Sparkles,
  MessageCircle,
  Minimize2,
  Maximize2
} from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'suggestion' | 'code' | 'explanation' | 'exercise'
}

interface SacredAIMentorProps {
  workshopContext?: {
    commandmentNumber: string
    title: string
    currentLesson?: string
    currentExercise?: string
  }
  onSuggestion?: (suggestion: string) => void
}

const SacredAIMentor: React.FC<SacredAIMentorProps> = ({ 
  workshopContext, 
  onSuggestion 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date(),
        type: 'explanation'
      }
      setMessages([welcomeMessage])
    }
  }, [workshopContext])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getWelcomeMessage = () => {
    if (workshopContext) {
      return `🙏 Willkommen beim heiligen ${workshopContext.title}! 

Ich bin dein KI-Mentor und begleite dich durch diese sacred journey. Ich kann dir helfen bei:

📚 **Erklärungen zu Konzepten** - Frag mich nach Details zu Lektionen
🛠️ **Code-Unterstützung** - Hilfe bei Übungen und Implementation
💡 **Strategische Beratung** - Best Practices und Optimierungen
🎯 **Personalisierte Tipps** - Angepasst an dein Skill-Level

Wie kann ich dir heute helfen?`
    }
    
    return `🙏 Grüße, sacred developer! 

Ich bin dein KI-Mentor für die Vibe Coding Bible. Egal ob du Fragen zu den heiligen Geboten hast, Code-Hilfe brauchst oder strategische Beratung suchst - ich bin hier für dich.

Was beschäftigt dich heute?`
  }

  const getContextualPrompts = () => {
    const prompts = [
      "Erkläre mir das Konzept nochmal",
      "Zeige mir ein Praxis-Beispiel",
      "Was sind häufige Fehler hier?",
      "Gib mir einen Pro-Tipp"
    ]

    if (workshopContext) {
      switch (workshopContext.commandmentNumber) {
        case 'I':
          return [
            "Wie erstelle ich eine kristallklare Vision?",
            "Zeige mir Vision Refinement Beispiele",
            "Was macht User Stories perfekt?",
            "Wie validiere ich meine Produktidee?"
          ]
        case 'II':
          return [
            "Welchen Tech Stack sollte ich wählen?",
            "Next.js vs andere Frameworks?",
            "Wie optimiere ich für AI-Development?",
            "Database Scaling Strategien?"
          ]
        case 'III':
          return [
            "Wie schreibe ich perfekte AI-Prompts?",
            "Zeige mir Prompt-Templates",
            "Chain-of-Thought Beispiele?",
            "Debugging mit AI-Assistenz?"
          ]
        default:
          return prompts
      }
    }
    
    return prompts
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Simulate AI response (in real implementation, this would call your AI API)
      const response = await simulateAIResponse(inputValue, workshopContext)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        type: response.type
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Entschuldigung, ich hatte ein technisches Problem. Bitte versuche es nochmal oder formuliere deine Frage anders.',
        timestamp: new Date(),
        type: 'explanation'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const simulateAIResponse = async (input: string, context?: any): Promise<{content: string, type: ChatMessage['type']}> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const lowerInput = input.toLowerCase()

    if (lowerInput.includes('vision') || lowerInput.includes('produktidee')) {
      return {
        content: `🎯 **Vision Development Guidance**

Für eine kristallklare Vision solltest du diese Schritte befolgen:

**1. Problem Definition**
- Wer hat das Problem genau?
- Wie schmerzhaft ist es auf einer Skala 1-10?
- Was sind die aktuellen Workarounds?

**2. Solution Hypothesis**
- Was ist dein einzigartiger Lösungsansatz?
- Warum ist er 10x besser als Alternativen?
- Welche Annahmen machst du?

**3. Validation Plan**
- Wie testest du deine Hypothesen?
- Mit welchen 5 Kunden sprichst du zuerst?

Möchtest du eine spezifische Produktidee durchgehen?`,
        type: 'explanation'
      }
    }

    if (lowerInput.includes('tech stack') || lowerInput.includes('technologie')) {
      return {
        content: `🏗️ **Tech Stack Selection Guide**

Für AI-assisted Development empfehle ich:

\`\`\`typescript
// The Sacred Stack
Frontend: Next.js 14 + TypeScript + Tailwind
Backend: Next.js API Routes + Prisma
Database: PostgreSQL (Supabase/Vercel)
Auth: NextAuth.js oder Supabase Auth
AI: Claude API + Vercel AI SDK
Hosting: Vercel (Zero-Config Deployment)
\`\`\`

**Warum dieser Stack?**
- ⚡ Optimal für AI-Assistenten
- 🚀 Rapid Development
- 📈 Leicht skalierbar
- 🛠️ Great DX (Developer Experience)

Hast du spezifische Anforderungen für dein Projekt?`,
        type: 'code'
      }
    }

    if (lowerInput.includes('prompt') || lowerInput.includes('ai')) {
      return {
        content: `🧠 **Perfect Prompt Crafting**

Die 7 Elemente eines göttlichen Prompts:

**1. Context Setting**
"Als erfahrener React Developer arbeite ich an..."

**2. Task Definition** 
"Erstelle eine TypeScript Komponente für..."

**3. Technical Constraints**
"Verwende React 18, TypeScript, Tailwind CSS..."

**4. Examples & Patterns**
"Ähnlich wie [Beispiel], aber mit..."

**5. Quality Criteria**
"Production-ready, gut dokumentiert, typisiert..."

**6. Edge Cases**
"Berücksichtige leere States, Fehlerbehandlung..."

**7. Output Format**
"Liefere kompletten Code mit Struktur..."

Probiere es aus - gib mir eine konkrete Aufgabe!`,
        type: 'explanation'
      }
    }

    if (lowerInput.includes('code') || lowerInput.includes('beispiel')) {
      return {
        content: `💻 **Code Beispiel**

Hier ist ein praktisches Beispiel:

\`\`\`typescript
// Sacred Component Pattern
interface SacredButtonProps {
  variant: 'primary' | 'secondary' | 'sacred'
  children: React.ReactNode
  onClick: () => void
  loading?: boolean
}

const SacredButton: React.FC<SacredButtonProps> = ({
  variant,
  children,
  onClick,
  loading = false
}) => {
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-gray-600 hover:bg-gray-700', 
    sacred: 'bg-gradient-to-r from-yellow-500 to-purple-600'
  }

  return (
    <button
      className={\`px-4 py-2 rounded transition-colors \${variantStyles[variant]}\`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
\`\`\`

Möchtest du das für ein spezifisches Use Case anpassen?`,
        type: 'code'
      }
    }

    // Default response
    return {
      content: `Interessante Frage! 🤔 

Ich verstehe, dass du mehr über "${input}" wissen möchtest. 

Hier sind einige Ansätze, die dir helfen könnten:

💡 **Strategisch denken**: Was ist dein Endziel?
🔍 **Spezifischer werden**: Kannst du ein konkretes Beispiel geben?
📚 **Learning Path**: Welches Commandment beschäftigt dich gerade?

Erzähl mir mehr Details, dann kann ich dir gezielter helfen!`,
      type: 'suggestion'
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageIcon = (type?: ChatMessage['type']) => {
    switch (type) {
      case 'code': return <Code className="w-4 h-4" />
      case 'suggestion': return <Lightbulb className="w-4 h-4" />
      case 'exercise': return <Target className="w-4 h-4" />
      case 'explanation': return <BookOpen className="w-4 h-4" />
      default: return <MessageCircle className="w-4 h-4" />
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-12 h-12 shadow-lg"
          style={{ background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)' }}
        >
          <Brain className="w-6 h-6" />
        </Button>
      </div>
    )
  }

  return (
    <Card 
      className={`fixed z-50 shadow-2xl transition-all duration-300 ${
        isExpanded 
          ? 'inset-4' 
          : 'bottom-4 right-4 w-96 h-[500px]'
      }`}
      style={{ 
        background: 'rgba(15, 23, 42, 0.95)', 
        borderColor: '#475569',
        backdropFilter: 'blur(10px)'
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="flex items-center gap-2 text-lg" style={{ color: '#FFCE00' }}>
          <Brain className="w-5 h-5" />
          Sacred AI Mentor
          <Sparkles className="w-4 h-4" style={{ color: '#009EE0' }} />
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ color: '#94a3b8' }}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            style={{ color: '#94a3b8' }}
          >
            ✕
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-full p-4 pt-0">
        {/* Messages */}
        <ScrollArea className="flex-1 mb-4 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-800 border border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 mt-1">
                        {getMessageIcon(message.type)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div 
                        className={`text-sm whitespace-pre-wrap ${
                          message.role === 'user' ? 'text-white' : 'text-gray-100'
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 p-2 rounded mt-2 mb-2 overflow-x-auto"><code>$1</code></pre>')
                            .replace(/`(.*?)`/g, '<code class="bg-gray-900 px-1 rounded">$1</code>')
                        }}
                      />
                      {message.type && (
                        <Badge 
                          variant="outline" 
                          className="mt-2 text-xs"
                          style={{ borderColor: '#475569', color: '#94a3b8' }}
                        >
                          {message.type}
                        </Badge>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <User className="w-4 h-4 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Suggestions */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {getContextualPrompts().slice(0, 2).map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                style={{ borderColor: '#475569', color: '#cbd5e1' }}
                onClick={() => setInputValue(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Stelle deine Frage zum heiligen Gebot..."
            className="min-h-[40px] max-h-32 resize-none"
            style={{ 
              background: 'rgba(30, 41, 59, 0.8)', 
              borderColor: '#475569',
              color: '#cbd5e1'
            }}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            style={{ background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)' }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SacredAIMentor