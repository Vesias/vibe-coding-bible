'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Brain, Send, Sparkles, MessageCircle, Target, BookOpen, Minimize2, Maximize2 } from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  type?: 'guidance' | 'exercise' | 'explanation' | 'code'
  timestamp: Date
}

interface SacredAIMentorProps {
  workshopContext: {
    currentStep: string
    progress: number
    commandment: string
  }
  onSuggestion?: (suggestion: string) => void
  onCodeSuggestion?: (code: string) => void
  onHint?: (hint: string) => void
}

const SacredAIMentor: React.FC<SacredAIMentorProps> = ({ 
  workshopContext, 
  onSuggestion,
  onCodeSuggestion,
  onHint 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        role: 'assistant',
        content: `🧙‍♂️ Willkommen zur Vibe Coding Bible! Ich bin dein Sacred AI Mentor.

Du befindest dich gerade im ${workshopContext.commandment} Workshop.

Wie kann ich dir beim Vibe Coding helfen?

**Tipps:**
- Frage nach konkreten Code-Beispielen
- Bitte um Erklärungen zu Konzepten
- Hole dir Feedback zu deinen Ideen`,
        type: 'guidance',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [workshopContext.commandment])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (input: string): ChatMessage => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('vision') || lowerInput.includes('gebot 1')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🎯 **Heilige Vision Development**

Das erste Gebot lehrt uns: Eine klare Vision ist das Fundament!

**Vision Canvas:**
1. **Problem**: Was löst du?
2. **Zielgruppe**: Für wen?
3. **Lösung**: Wie löst du es?
4. **Erfolg**: Woran misst du Erfolg?

Möchtest du deine Vision gemeinsam entwickeln?`,
        type: 'guidance',
        timestamp: new Date()
      }
    }

    if (lowerInput.includes('stack') || lowerInput.includes('technologie')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🛠️ **Der Rechte Stack**

Für KI-unterstützte Entwicklung empfehle ich:

**Frontend:**
- Next.js 15 (App Router)
- React 18 (Server Components)
- TypeScript
- Tailwind CSS

**Backend:**
- Node.js/Deno
- tRPC oder REST APIs
- PostgreSQL/Supabase

**KI-Tools:**
- Claude/ChatGPT für Code-Generation
- GitHub Copilot für Auto-Complete
- Cursor für KI-IDE

Welchen Stack planst du zu verwenden?`,
        type: 'explanation',
        timestamp: new Date()
      }
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `💭 Interessante Frage! Lass mich dir helfen.

Basierend auf dem aktuellen Workshop-Kontext (${workshopContext.commandment}) kann ich dir folgende Unterstützung anbieten:

- **Code-Beispiele** für praktische Umsetzung
- **Konzept-Erklärungen** für tieferes Verständnis  
- **Best Practices** aus der Vibe Coding Bible

Stelle gerne eine konkretere Frage!`,
      type: 'guidance',
      timestamp: new Date()
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(inputValue)
      setMessages(prev => [...prev, response])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'guidance': return <Sparkles className="w-4 h-4" />
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
                      <div className="mt-1" style={{ color: '#FFCE00' }}>
                        {getMessageIcon(message.type)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm whitespace-pre-wrap" style={{ color: '#e2e8f0' }}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" style={{ color: '#FFCE00' }} />
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