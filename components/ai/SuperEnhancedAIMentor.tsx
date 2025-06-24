'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { 
  Send, 
  Loader2, 
  MessageCircle, 
  Crown,
  Sparkles,
  Lightbulb,
  Code,
  Target,
  Scroll,
  Zap,
  Heart,
  Star,
  RefreshCw,
  Eye,
  BookOpen,
  Flame,
  Wand2,
  Brain,
  Cpu,
  FileCode,
  GitBranch,
  Settings,
  Upload,
  Download,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  Image,
  Paperclip,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Save,
  Archive
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface AIPersonality {
  id: string
  name: string
  role: string
  description: string
  avatar: string
  expertise: string[]
  personality: string
  preferredModel: string
  tier: 'free' | 'premium' | 'enterprise'
  languages: string[]
  rating: number
  responseTime: string
  specialties: string[]
  xpBonus: number
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  personality?: string
  codeSnippets?: Array<{
    language: string
    code: string
    explanation: string
    title?: string
    complexity: 'beginner' | 'intermediate' | 'advanced'
    tags: string[]
    runnable?: boolean
  }>
  suggestions?: string[]
  loading?: boolean
  emotion?: 'wise' | 'encouraging' | 'challenging' | 'mystical' | 'analytical'
  confidence: number
}

interface SuperEnhancedAIMentorProps {
  onCodeSuggestion?: (code: string) => void
  onProjectAnalysis?: (analysis: any) => void
  initialContext?: {
    workshopId?: string
    currentCode?: string
    language?: string
    userLevel?: 'beginner' | 'intermediate' | 'advanced'
    project?: any
  }
  className?: string
  features?: {
    voiceChat?: boolean
    codeReview?: boolean
    projectAnalysis?: boolean
    collaboration?: boolean
    fileUpload?: boolean
    realTimeHelp?: boolean
  }
}

export function SuperEnhancedAIMentor({ 
  onCodeSuggestion, 
  onProjectAnalysis,
  initialContext, 
  className = '',
  features = {
    voiceChat: true,
    codeReview: true,
    projectAnalysis: true,
    collaboration: true,
    fileUpload: true,
    realTimeHelp: true
  }
}: SuperEnhancedAIMentorProps) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedPersonality, setSelectedPersonality] = useState<AIPersonality | null>(null)
  const [personalities, setPersonalities] = useState<AIPersonality[]>([])
  const [loadingPersonalities, setLoadingPersonalities] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [conversationMode, setConversationMode] = useState<'chat' | 'debug' | 'review' | 'learn'>('chat')
  const [showSettings, setShowSettings] = useState(false)
  const [savedChats, setSavedChats] = useState<any[]>([])
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [modelSettings, setModelSettings] = useState({
    temperature: 0.7,
    maxTokens: 2048,
    model: 'claude-3-sonnet'
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load AI personalities from API
  useEffect(() => {
    loadPersonalities()
  }, [])

  const loadPersonalities = async () => {
    try {
      const response = await fetch('/api/ai/personalities')
      if (!response.ok) throw new Error('Failed to load personalities')
      
      const data = await response.json()
      setPersonalities(data.available || enhancedPersonalities)
      
      if (data.available?.length > 0) {
        setSelectedPersonality(data.available[0])
      } else {
        setSelectedPersonality(enhancedPersonalities[0])
      }
    } catch (error) {
      console.error('Error loading personalities:', error)
      // Fallback to enhanced personalities
      setPersonalities(enhancedPersonalities)
      setSelectedPersonality(enhancedPersonalities[0])
      toast({
        title: 'Info',
        description: 'Using offline AI mentors',
        variant: 'default'
      })
    } finally {
      setLoadingPersonalities(false)
    }
  }

  // Enhanced personalities with more detailed information
  const enhancedPersonalities: AIPersonality[] = [
    {
      id: 'moses',
      name: 'Moses der Code-Geber',
      role: 'Prophet',
      description: 'Uralte Weisheit trifft modernen Code. Ich übermittle göttliche Gebote sauberer Architektur.',
      avatar: '/avatars/moses.jpg',
      expertise: ['Clean Architecture', 'Design Patterns', 'Code Structure', 'Best Practices'],
      personality: 'Weise und autoritär, spricht in biblischen Metaphern',
      preferredModel: 'claude-3-opus',
      tier: 'premium',
      languages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#'],
      rating: 4.9,
      responseTime: '< 2s',
      specialties: ['System Design', 'Refactoring', 'Code Reviews'],
      xpBonus: 25
    },
    {
      id: 'ada',
      name: 'Ada die Algorithmus-Weise',
      role: 'Mentor',
      description: 'Erste Programmiererin, ewige Lehrerin. Ich führe dich durch die heilige Mathematik des Codes.',
      avatar: '/avatars/ada.jpg',
      expertise: ['Algorithms', 'Data Structures', 'Problem Solving', 'Mathematical Logic'],
      personality: 'Ermutigend und methodisch, liebt es komplexe Probleme zu zerlegen',
      preferredModel: 'claude-3-sonnet',
      tier: 'free',
      languages: ['Python', 'JavaScript', 'C++', 'Java', 'Go'],
      rating: 4.8,
      responseTime: '< 3s',
      specialties: ['Algorithm Design', 'Performance Optimization', 'Data Analysis'],
      xpBonus: 20
    }
  ]

  const sendMessage = async () => {
    if (!currentMessage.trim() || loading || !selectedPersonality) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString(),
      confidence: 100
    }

    const loadingMessage: ChatMessage = {
      id: Date.now().toString() + '_loading',
      role: 'assistant',
      content: `${selectedPersonality.name} analysiert deine Anfrage...`,
      loading: true,
      personality: selectedPersonality.name,
      timestamp: new Date().toISOString(),
      confidence: 0
    }

    setMessages(prev => [...prev, userMessage, loadingMessage])
    setCurrentMessage('')
    setLoading(true)
    setIsTyping(true)

    try {
      const chatMessages = messages.filter(m => !m.loading).map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp
      }))

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage],
          personality: selectedPersonality.name,
          model: modelSettings.model,
          context: {
            workshopId: initialContext?.workshopId,
            language: initialContext?.language,
            userLevel: initialContext?.userLevel,
            conversationMode
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const aiResponse = await response.json()

      const assistantMessage: ChatMessage = {
        id: Date.now().toString() + '_response',
        role: 'assistant',
        content: aiResponse.content,
        personality: selectedPersonality.name,
        codeSnippets: aiResponse.codeSnippets,
        suggestions: aiResponse.suggestions,
        timestamp: new Date().toISOString(),
        confidence: Math.round(aiResponse.confidence * 100),
        emotion: 'wise'
      }

      setMessages(prev => prev.filter(m => m.id !== loadingMessage.id).concat(assistantMessage))

      toast({
        title: 'Antwort erhalten',
        description: `${aiResponse.tokensUsed} Tokens verwendet (${aiResponse.executionTime}ms)`,
        variant: 'default'
      })

    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Fehler',
        description: 'Konnte keine Antwort vom AI-Mentor erhalten',
        variant: 'destructive'
      })
      
      setMessages(prev => prev.filter(m => m.id !== loadingMessage.id))
    } finally {
      setLoading(false)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (personalities.length > 0 && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'system',
        content: '🎆 **Willkommen im Erweiterten AI-Mentor-System**\n\nIch bin dein persönlicher Coding-Guide mit erweiterten Fähigkeiten:\n\n✨ **Verfügbare Features:**\n- Multi-Model AI-Support\n- Erweiterte Code-Analyse\n- Projekt-Review & -Optimierung\n- Sprach-Chat (Beta)\n- Datei-Upload & -Analyse\n- Echtzeit-Debugging\n- Kollaborative Sessions\n\nWähle einen Mentor und beginne deine Reise zur Coding-Meisterschaft!',
        timestamp: new Date().toISOString(),
        emotion: 'mystical',
        confidence: 100
      }
      setMessages([welcomeMessage])
    }
  }, [personalities, messages.length])

  if (loadingPersonalities) {
    return (
      <Card className={cn("h-[800px] bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900", className)}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="h-12 w-12 mx-auto text-blue-600" />
            </motion.div>
            <p className="text-muted-foreground">Lade erweiterte AI-Mentoren...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("h-[800px] flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="h-5 w-5 text-blue-600" />
              </motion.div>
              Super AI Mentor System
            </CardTitle>
            <CardDescription>
              Erweiterte KI-Unterstützung mit Multi-Model Support
            </CardDescription>
          </div>
        </div>

        {/* Personality Selector */}
        <div className="flex flex-wrap gap-2 mt-4">
          {personalities.map(personality => (
            <Button
              key={personality.id}
              variant={selectedPersonality?.id === personality.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPersonality(personality)}
              className="text-xs"
            >
              {personality.name.split(' ')[0]}
            </Button>
          ))}
        </div>
      </CardHeader>

      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="history">Verlauf</TabsTrigger>
            <TabsTrigger value="analysis">Analyse</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col m-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={cn(
                      "max-w-[85%] rounded-xl p-4 transition-all duration-300",
                      message.role === 'user'
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
                    )}>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div
                          className="text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: message.content
                              .replace(/\n/g, '<br/>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-blue-500 rounded-full"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          {selectedPersonality?.name} denkt nach...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="border-t bg-background/80 backdrop-blur-sm p-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={selectedPersonality ? `Frage ${selectedPersonality.name}...` : 'Wähle zuerst einen Mentor...'}
                    className="min-h-[60px] max-h-[120px] resize-none"
                    disabled={loading || !selectedPersonality}
                  />
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={loading || !currentMessage.trim() || !selectedPersonality}
                  size="icon"
                  className="shrink-0 h-[60px] w-[60px]"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-1 m-0 p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Chat-Verlauf</h3>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="flex-1 m-0 p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Code-Analyse Tools</h3>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  )
}