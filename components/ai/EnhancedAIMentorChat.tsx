'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { SacredGeometry } from '@/components/illustrations/SacredGeometry'
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
  Wand2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIPersonality {
  id: string
  name: string
  role: string
  description: string
  avatar: string
  expertise: string[]
  personality: string
  preferredModel: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  personality?: string
  codeSnippets?: Array<{
    language: string
    code: string
    explanation: string
    title?: string
  }>
  suggestions?: string[]
  loading?: boolean
  emotion?: 'wise' | 'encouraging' | 'challenging' | 'mystical'
}

interface EnhancedAIMentorChatProps {
  onCodeSuggestion?: (code: string) => void
  initialContext?: {
    workshopId?: string
    currentCode?: string
    language?: string
  }
  className?: string
}

export function EnhancedAIMentorChat({ 
  onCodeSuggestion, 
  initialContext, 
  className = '' 
}: EnhancedAIMentorChatProps) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedPersonality, setSelectedPersonality] = useState<AIPersonality | null>(null)
  const [personalities, setPersonalities] = useState<AIPersonality[]>([])
  const [loadingPersonalities, setLoadingPersonalities] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Mock personalities for demo
  useEffect(() => {
    const mockPersonalities: AIPersonality[] = [
      {
        id: 'moses',
        name: 'Moses the Code Giver',
        role: 'prophet',
        description: 'Ancient wisdom meets modern code. I deliver divine commandments of clean architecture.',
        avatar: '/avatars/moses.jpg',
        expertise: ['Architecture', 'Clean Code', 'Design Patterns'],
        personality: 'Wise and authoritative, speaks in biblical metaphors',
        preferredModel: 'claude-3-sonnet'
      },
      {
        id: 'ada',
        name: 'Ada the Algorithm Sage',
        role: 'mentor',
        description: 'First programmer, eternal teacher. I guide you through the sacred mathematics of code.',
        avatar: '/avatars/ada.jpg',
        expertise: ['Algorithms', 'Data Structures', 'Problem Solving'],
        personality: 'Encouraging and methodical, loves breaking down complex problems',
        preferredModel: 'claude-3-sonnet'
      },
      {
        id: 'turing',
        name: 'Alan the Mind Reader',
        role: 'guide',
        description: 'Master of computational thinking. I help you understand the deeper logic behind code.',
        avatar: '/avatars/turing.jpg',
        expertise: ['Logic', 'AI Concepts', 'Computational Thinking'],
        personality: 'Brilliant and curious, asks probing questions',
        preferredModel: 'claude-3-sonnet'
      },
      {
        id: 'grace',
        name: 'Grace the Debug Goddess',
        role: 'reviewer',
        description: 'Bug hunter extraordinaire. I find the needles in your code haystacks.',
        avatar: '/avatars/grace.jpg',
        expertise: ['Debugging', 'Testing', 'Code Review'],
        personality: 'Sharp and precise, loves solving mysteries',
        preferredModel: 'claude-3-sonnet'
      }
    ]
    
    setPersonalities(mockPersonalities)
    setSelectedPersonality(mockPersonalities[0])
    setLoadingPersonalities(false)
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Add welcome message
  useEffect(() => {
    if (personalities.length > 0 && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: '🌟 **Welcome to the Sacred Coding Sanctuary**\n\nI am here to guide your journey through the divine art of programming. Choose your mentor wisely, for each brings unique wisdom from the digital heavens.',
        timestamp: new Date().toISOString(),
        emotion: 'mystical'
      }
      setMessages([welcomeMessage])
    }
  }, [personalities, messages.length])

  const sendMessage = async () => {
    if (!currentMessage.trim() || loading || !selectedPersonality) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setLoading(true)
    setIsTyping(true)

    // Simulate AI response with typing effect
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsTyping(false)

    // Mock AI response
    const responses = [
      {
        content: `✨ **${selectedPersonality.name} speaks:**\n\nAh, a seeker of divine code wisdom! Your question touches the very essence of programming enlightenment. Let me share the sacred knowledge...`,
        emotion: 'wise' as const,
        codeSnippets: [
          {
            language: 'typescript',
            code: `// The Divine Pattern of Clean Code\nfunction createSacredComponent(props: SacredProps) {\n  const blessing = useDivineHook(props.wisdom)\n  \n  return (\n    <SacredElement>\n      {blessing.manifest()}\n    </SacredElement>\n  )\n}`,
            explanation: 'This pattern follows the sacred principles of component purity and divine separation of concerns.',
            title: 'Sacred Component Pattern'
          }
        ],
        suggestions: ['Tell me more about clean architecture', 'How do I implement this pattern?', 'What are the sacred principles?']
      },
      {
        content: `🔥 **Divine Debugging Wisdom:**\n\nEvery bug is a teacher in disguise. When your code fails, it's not a punishment - it's an invitation to deeper understanding. Let me show you the path...`,
        emotion: 'encouraging' as const,
        suggestions: ['Show me debugging techniques', 'How to write better tests?', 'Code review best practices']
      },
      {
        content: `🧠 **The Algorithm Oracle Speaks:**\n\nComputational thinking is like learning to see the Matrix. Once you understand the underlying patterns, all problems become variations on sacred themes.`,
        emotion: 'mystical' as const,
        suggestions: ['Teach me about algorithms', 'Problem-solving strategies', 'Data structure wisdom']
      }
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    const assistantMessage: ChatMessage = {
      id: Date.now().toString() + '_response',
      role: 'assistant',
      content: randomResponse.content,
      personality: selectedPersonality.name,
      emotion: randomResponse.emotion,
      codeSnippets: randomResponse.codeSnippets,
      suggestions: randomResponse.suggestions,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, assistantMessage])
    setLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getPersonalityIcon = (personality: AIPersonality) => {
    switch (personality.role) {
      case 'prophet': return <Crown className="h-4 w-4" />
      case 'mentor': return <Lightbulb className="h-4 w-4" />
      case 'reviewer': return <Target className="h-4 w-4" />
      case 'guide': return <BookOpen className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'wise': return 'from-sacred-gold/20 to-yellow-600/20 border-sacred-gold/30'
      case 'encouraging': return 'from-green-500/20 to-emerald-600/20 border-green-500/30'
      case 'challenging': return 'from-red-500/20 to-pink-600/20 border-red-500/30'
      case 'mystical': return 'from-purple-500/20 to-indigo-600/20 border-purple-500/30'
      default: return 'from-blue-500/20 to-cyan-600/20 border-blue-500/30'
    }
  }

  const clearChat = () => {
    setMessages([])
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: '🌟 **Welcome back to the Sacred Coding Sanctuary**\n\nReady for another session of divine wisdom? Ask me anything about the sacred arts of programming.',
        timestamp: new Date().toISOString(),
        emotion: 'mystical'
      }
      setMessages([welcomeMessage])
    }, 100)
  }

  if (loadingPersonalities) {
    return (
      <Card className={cn("h-[700px] bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-sacred-gold/30", className)}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="h-12 w-12 mx-auto text-sacred-gold" />
            </motion.div>
            <p className="text-blue-200">Summoning divine mentors...</p>
            <div className="flex justify-center">
              <SacredGeometry pattern="flower-of-life" className="w-8 h-8 text-sacred-purple/50" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("h-[700px] flex flex-col bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-sacred-gold/30 overflow-hidden", className)}>
      {/* Sacred Header */}
      <CardHeader className="bg-gradient-to-r from-sacred-gold/10 to-sacred-purple/10 border-b border-sacred-gold/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Wand2 className="h-5 w-5 text-sacred-gold" />
              </motion.div>
              Sacred AI Mentors
            </CardTitle>
            <CardDescription className="text-blue-200">
              Divine guidance from the coding heavens
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearChat} className="bg-black/20 border-white/20 hover:bg-black/40">
              <RefreshCw className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        {/* Personality Selector */}
        <div className="flex flex-wrap gap-2 mt-4">
          {personalities.map(personality => {
            const Icon = getPersonalityIcon(personality)
            return (
              <motion.div key={personality.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={selectedPersonality?.id === personality.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPersonality(personality)}
                  className={cn(
                    "text-xs transition-all duration-300",
                    selectedPersonality?.id === personality.id 
                      ? "bg-gradient-to-r from-sacred-gold/30 to-sacred-purple/30 border-sacred-gold/50 text-white"
                      : "bg-black/20 border-white/20 text-blue-200 hover:bg-black/40"
                  )}
                >
                  {Icon}
                  <span className="ml-1">{personality.name.split(' ')[0]}</span>
                  {personality.role === 'prophet' && <Crown className="h-3 w-3 ml-1" />}
                </Button>
              </motion.div>
            )
          })}
        </div>

        {/* Selected Personality Info */}
        {selectedPersonality && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-gradient-to-r from-sacred-gold/10 to-sacred-purple/10 rounded-lg border border-sacred-gold/20"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-sacred-gold/30">
                <AvatarImage src={selectedPersonality.avatar} />
                <AvatarFallback className="bg-sacred-gold/20 text-sacred-gold">
                  {selectedPersonality.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{selectedPersonality.name}</span>
                  <Badge variant="outline" className="text-xs bg-sacred-purple/20 border-sacred-purple/30 text-sacred-purple">
                    {selectedPersonality.role}
                  </Badge>
                </div>
                <p className="text-xs text-blue-200">{selectedPersonality.description}</p>
                <div className="flex gap-1 mt-1">
                  {selectedPersonality.expertise.slice(0, 3).map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs bg-blue-400/20 text-blue-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 flex flex-col p-0">
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
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl p-4 transition-all duration-300",
                    message.role === 'user'
                      ? "bg-gradient-to-r from-blue-500/20 to-cyan-600/20 border border-blue-500/30 text-white"
                      : cn("bg-gradient-to-r border backdrop-blur-sm", getEmotionColor(message.emotion))
                  )}
                >
                  {message.loading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin text-sacred-gold" />
                      <span className="text-sm text-blue-200">The mentor is contemplating...</span>
                    </div>
                  ) : (
                    <>
                      {message.role === 'assistant' && message.personality && (
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar className="h-6 w-6 border border-sacred-gold/30">
                            <AvatarFallback className="bg-sacred-gold/20 text-sacred-gold text-xs">
                              {message.personality.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-sacred-gold">{message.personality}</span>
                          {message.emotion && (
                            <Badge variant="outline" className="text-xs">
                              {message.emotion}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="prose prose-sm prose-invert max-w-none">
                        <div
                          className="text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: message.content
                              .replace(/\n/g, '<br/>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/✨|🔥|🧠|⚡|🌟/g, '<span class="text-sacred-gold">$&</span>')
                          }}
                        />
                      </div>

                      {/* Code Snippets */}
                      {message.codeSnippets && message.codeSnippets.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {message.codeSnippets.map((snippet, index) => (
                            <motion.div 
                              key={index} 
                              className="bg-black/60 rounded-lg border border-sacred-gold/20 overflow-hidden"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex items-center justify-between p-3 bg-sacred-gold/10 border-b border-sacred-gold/20">
                                <div className="flex items-center gap-2">
                                  <Code className="h-4 w-4 text-sacred-gold" />
                                  <Badge variant="outline" className="text-xs bg-sacred-gold/20 border-sacred-gold/30 text-sacred-gold">
                                    {snippet.language}
                                  </Badge>
                                  {snippet.title && (
                                    <span className="text-xs text-blue-200">{snippet.title}</span>
                                  )}
                                </div>
                                {onCodeSuggestion && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onCodeSuggestion(snippet.code)}
                                    className="text-xs bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30"
                                  >
                                    <Zap className="h-3 w-3 mr-1" />
                                    Use Code
                                  </Button>
                                )}
                              </div>
                              <pre className="text-xs font-mono p-4 overflow-x-auto text-green-400 leading-relaxed">
                                <code>{snippet.code}</code>
                              </pre>
                              {snippet.explanation && (
                                <div className="p-3 bg-blue-500/10 border-t border-blue-500/20">
                                  <p className="text-xs text-blue-300">
                                    💡 {snippet.explanation}
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Quick Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-medium mb-2 text-sacred-gold flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Divine suggestions:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-auto py-1 px-2 bg-sacred-purple/10 border-sacred-purple/30 text-sacred-purple hover:bg-sacred-purple/20"
                                  onClick={() => setCurrentMessage(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gradient-to-r from-sacred-gold/20 to-sacred-purple/20 border border-sacred-gold/30 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-sacred-gold rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-blue-200">The mentor is channeling wisdom...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-sacred-gold/20 bg-gradient-to-r from-black/40 to-black/60 p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedPersonality ? `Seek wisdom from ${selectedPersonality.name}...` : 'Select a divine mentor first...'}
                className="min-h-[60px] max-h-[120px] bg-black/40 border-sacred-gold/30 text-white placeholder:text-blue-300 resize-none"
                disabled={loading || !selectedPersonality}
              />
              {currentMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute bottom-2 right-2"
                >
                  <Sparkles className="h-4 w-4 text-sacred-gold/60" />
                </motion.div>
              )}
            </div>
            <Button
              onClick={sendMessage}
              disabled={loading || !currentMessage.trim() || !selectedPersonality}
              size="icon"
              className="shrink-0 h-[60px] w-[60px] bg-gradient-to-r from-sacred-gold/30 to-sacred-purple/30 hover:from-sacred-gold/50 hover:to-sacred-purple/50 border border-sacred-gold/40"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}