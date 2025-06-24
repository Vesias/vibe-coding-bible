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
import { Progress } from '@/components/ui/progress'
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
  attachments?: Array<{
    type: 'image' | 'file' | 'link'
    url: string
    name: string
    size?: number
  }>
  rating?: number
  feedback?: 'helpful' | 'not_helpful'
  errorAnalysis?: {
    type: string
    severity: 'low' | 'medium' | 'high'
    fixes: string[]
    prevention: string[]
  }
  confidence: number
  citations?: string[]
  followUp?: string[]
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
    },
    {
      id: 'turing',
      name: 'Alan der Gedankenleser',
      role: 'Guide',
      description: 'Meister des rechnerischen Denkens. Ich helfe dir die tiefere Logik hinter dem Code zu verstehen.',
      avatar: '/avatars/turing.jpg',
      expertise: ['Logic', 'AI Concepts', 'Computational Thinking', 'Machine Learning'],
      personality: 'Brillant und neugierig, stellt durchdringende Fragen',
      preferredModel: 'gpt-4-turbo',
      tier: 'premium',
      languages: ['Python', 'R', 'MATLAB', 'TensorFlow', 'PyTorch'],
      rating: 4.9,
      responseTime: '< 2s',
      specialties: ['AI/ML', 'Deep Learning', 'Neural Networks'],
      xpBonus: 30
    },
    {
      id: 'grace',
      name: 'Grace die Debug-Göttin',
      role: 'Reviewer',
      description: 'Bug-Jägerin par excellence. Ich finde die Nadeln in deinen Code-Heuhaufen.',
      avatar: '/avatars/grace.jpg',
      expertise: ['Debugging', 'Testing', 'Code Review', 'Quality Assurance'],
      personality: 'Scharf und präzise, liebt es Rätsel zu lösen',
      preferredModel: 'claude-3-sonnet',
      tier: 'free',
      languages: ['JavaScript', 'Python', 'Java', 'C#', 'PHP'],
      rating: 4.7,
      responseTime: '< 3s',
      specialties: ['Error Analysis', 'Test Automation', 'Code Quality'],
      xpBonus: 15
    },
    {
      id: 'linus',
      name: 'Linus der System-Architekt',
      role: 'Architect',
      description: 'Kernel-Entwickler und System-Designer. Ich zeige dir wie man robuste, skalierbare Systeme baut.',
      avatar: '/avatars/linus.jpg',
      expertise: ['System Programming', 'Operating Systems', 'Performance', 'Scalability'],
      personality: 'Direkt und kompromisslos, fokussiert auf Effizienz',
      preferredModel: 'claude-3-opus',
      tier: 'enterprise',
      languages: ['C', 'C++', 'Rust', 'Go', 'Assembly'],
      rating: 4.9,
      responseTime: '< 1s',
      specialties: ['Systems Architecture', 'Performance Tuning', 'DevOps'],
      xpBonus: 35
    },
    {
      id: 'margaret',
      name: 'Margaret die Code-Visionärin',
      role: 'Visionary',
      description: 'Pionierin der Softwareentwicklung. Ich helfe dir moderne Entwicklungspraktiken zu meistern.',
      avatar: '/avatars/margaret.jpg',
      expertise: ['Software Engineering', 'Project Management', 'Agile', 'Team Leadership'],
      personality: 'Visionär und pragmatisch, verbindet Theorie mit Praxis',
      preferredModel: 'gpt-4-turbo',
      tier: 'premium',
      languages: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Docker'],
      rating: 4.8,
      responseTime: '< 2s',
      specialties: ['Full-Stack Development', 'DevOps', 'Team Management'],
      xpBonus: 25
    }
  ]

  useEffect(() => {
    setPersonalities(enhancedPersonalities)
    setSelectedPersonality(enhancedPersonalities[0])
    setLoadingPersonalities(false)
    loadChatHistory()
  }, [])

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

  const loadChatHistory = async () => {
    // Mock implementation - in real app, load from API
    const mockHistory = [
      { id: '1', title: 'React Hooks Debugging', date: '2024-01-19', messages: 12 },
      { id: '2', title: 'Algorithm Optimization', date: '2024-01-18', messages: 8 },
      { id: '3', title: 'TypeScript Setup', date: '2024-01-17', messages: 15 }
    ]
    setChatHistory(mockHistory)
  }

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
      // Call the real AI API
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

      // Update usage stats
      setUsageStats(prev => ({
        ...prev,
        tokensUsed: (prev.tokensUsed || 0) + aiResponse.tokensUsed,
        cost: (prev.cost || 0) + aiResponse.cost,
        requests: (prev.requests || 0) + 1
      }))

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

  // File upload handler
  const handleFileUpload = async (files: FileList) => {
    if (!files.length || !selectedPersonality) return

    const file = files[0]
    
    // Validate file size and type
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Datei zu groß',
        description: 'Bitte lade Dateien kleiner als 10MB hoch',
        variant: 'destructive'
      })
      return
    }

    setFileUploadProgress(0)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('personality', selectedPersonality.name)
    formData.append('analysisType', 'general')

    try {
      const response = await fetch('/api/ai/file-upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('File upload failed')
      }

      const result = await response.json()

      // Add file analysis as a message
      const fileMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: result.analysis.content,
        personality: selectedPersonality.name,
        codeSnippets: result.analysis.codeSnippets,
        suggestions: result.analysis.suggestions,
        timestamp: new Date().toISOString(),
        confidence: 95,
        emotion: 'analytical',
        attachments: [{
          type: 'file',
          url: '',
          name: file.name,
          size: file.size
        }]
      }

      setMessages(prev => [...prev, fileMessage])
      setUploadedFiles(prev => [...prev, result])

      toast({
        title: 'Datei analysiert',
        description: `${file.name} wurde erfolgreich analysiert`,
        variant: 'default'
      })

    } catch (error) {
      console.error('File upload error:', error)
      toast({
        title: 'Upload-Fehler',
        description: 'Datei konnte nicht analysiert werden',
        variant: 'destructive'
      })
    } finally {
      setFileUploadProgress(0)
    }
  }

  // Voice chat handler (mock implementation)
  const handleVoiceChat = async () => {
    if (!selectedPersonality) return

    if (!isListening) {
      setIsListening(true)
      setIsVoiceActive(true)
      
      // Mock voice recording
      setTimeout(() => {
        setIsListening(false)
        setIsVoiceActive(false)
        
        // Add a voice response message
        const voiceMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `🎙️ **${selectedPersonality.name} spricht:**\n\nHallo! Ich habe deine Sprachnachricht erhalten. Voice-Chat ist noch in der Beta-Phase, aber ich kann bereits grundlegende Sprachbefehle verstehen. Probiere es gerne aus!`,
          personality: selectedPersonality.name,
          timestamp: new Date().toISOString(),
          confidence: 90,
          emotion: 'encouraging'
        }
        
        setMessages(prev => [...prev, voiceMessage])
        
        toast({
          title: 'Sprachnachricht empfangen',
          description: 'Voice-Chat ist noch in der Beta-Phase',
          variant: 'default'
        })
      }, 3000)
    } else {
      setIsListening(false)
      setIsVoiceActive(false)
    }
  }

  // Code review handler
  const handleCodeReview = async (code: string, language: string) => {
    if (!selectedPersonality) return

    try {
      const response = await fetch('/api/ai/code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          userLevel: initialContext?.userLevel || 'intermediate',
          focusAreas: ['bugs', 'performance', 'readability', 'best-practices'],
          workshopContext: initialContext?.workshopId ? {
            workshopId: initialContext.workshopId,
            stepId: 'current',
            objectives: ['Code quality improvement']
          } : undefined
        })
      })

      if (!response.ok) {
        throw new Error('Code review failed')
      }

      const review = await response.json()

      // Add code review as a message
      const reviewMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🔍 **Code Review von ${selectedPersonality.name}:**\n\n**Gesamt-Score: ${review.overall.score}/100**\n\n**Zusammenfassung:** ${review.overall.summary}\n\n**Level:** ${review.overall.level}\n\n**Gefundene Issues:** ${review.issues.length}\n**Verbesserungsvorschläge:** ${review.improvements.length}\n\n**Positive Aspekte:**\n${review.positives.map((p: string) => `✅ ${p}`).join('\n')}\n\n**Nächste Schritte:**\n${review.nextSteps.map((s: string) => `📝 ${s}`).join('\n')}\n\n**Göttliche Weisheit:** ${review.divineWisdom}`,
        personality: selectedPersonality.name,
        timestamp: new Date().toISOString(),
        confidence: 95,
        emotion: 'analytical'
      }

      setMessages(prev => [...prev, reviewMessage])

      toast({
        title: 'Code Review abgeschlossen',
        description: `Score: ${review.overall.score}/100`,
        variant: 'default'
      })

    } catch (error) {
      console.error('Code review error:', error)
      toast({
        title: 'Review-Fehler',
        description: 'Code konnte nicht analysiert werden',
        variant: 'destructive'
      })
    }
  }

    const enhancedResponses = [
      {
        content: `🤖 **${selectedPersonality.name} analysiert:**\n\nExzellente Frage! Basierend auf deinem Code-Kontext und Level erkenne ich folgende Optimierungsmöglichkeiten. Hier ist mein detaillierter Lösungsansatz...`,
        emotion: 'analytical' as const,
        confidence: 92,
        codeSnippets: [
          {
            language: 'typescript',
            code: `// Enhanced Pattern: Smart Component Architecture\ninterface SmartComponentProps<T> {\n  data: T\n  onUpdate: (data: T) => Promise<void>\n  validation?: (data: T) => ValidationResult\n  caching?: CacheStrategy\n}\n\nfunction createSmartComponent<T>(\n  config: SmartComponentProps<T>\n): SmartComponent<T> {\n  const [state, setState] = useState(config.data)\n  const [loading, setLoading] = useState(false)\n  const [errors, setErrors] = useState<ValidationError[]>([])\n  \n  const optimizedUpdate = useCallback(\n    debounce(async (newData: T) => {\n      if (config.validation) {\n        const result = config.validation(newData)\n        if (!result.isValid) {\n          setErrors(result.errors)\n          return\n        }\n      }\n      \n      setLoading(true)\n      try {\n        await config.onUpdate(newData)\n        setState(newData)\n        setErrors([])\n      } catch (error) {\n        setErrors([{ message: error.message, field: 'general' }])\n      } finally {\n        setLoading(false)\n      }\n    }, 300),\n    [config]\n  )\n  \n  return {\n    state,\n    loading,\n    errors,\n    update: optimizedUpdate,\n    reset: () => setState(config.data)\n  }\n}`,
            explanation: 'Dieses erweiterte Pattern kombiniert State Management, Validation, Error Handling und Performance-Optimierung in einer wiederverwendbaren Abstraktion.',
            title: 'Smart Component Architecture',
            complexity: 'advanced' as const,
            tags: ['React', 'TypeScript', 'Performance', 'Architecture'],
            runnable: true
          }
        ],
        suggestions: [
          'Zeige mir Performance-Optimierungen',
          'Wie implementiere ich Caching?',
          'Error Handling Best Practices',
          'Testing-Strategien für dieses Pattern'
        ],
        citations: [
          'React Performance Patterns - reactjs.org',
          'TypeScript Advanced Types - typescriptlang.org'
        ],
        followUp: [
          'Möchtest du eine vollständige Implementierung sehen?',
          'Soll ich dir zeigen, wie man das Pattern testet?',
          'Interessiert dich die Integration mit State Management Libraries?'
        ]
      },
      {
        content: `🔥 **Debugging-Strategie aktiviert:**\n\nIch erkenne ein häufiges Problem! Lass mich dir eine systematische Lösung zeigen. Hier ist mein 5-Stufen-Debugging-Ansatz...`,
        emotion: 'encouraging' as const,
        confidence: 88,
        errorAnalysis: {
          type: 'Logic Error',
          severity: 'medium' as const,
          fixes: [
            'Füge defensive Programmierung hinzu',
            'Implementiere Input-Validation',
            'Erweitere Error Boundaries',
            'Verbessere Logging'
          ],
          prevention: [
            'Nutze TypeScript für Type Safety',
            'Schreibe Unit Tests',
            'Implementiere ESLint Rules',
            'Code Review Process'
          ]
        },
        suggestions: [
          'Zeige mir Debugging-Tools',
          'Wie schreibe ich bessere Tests?',
          'Error Monitoring Setup',
          'Logging Best Practices'
        ]
      },
      {
        content: `🧠 **Algorithmus-Analyse:**\n\nFaszinierend! Dein Problem lässt sich elegant mit einem modernen Algorithmus lösen. Hier ist die mathematische Betrachtung und optimale Implementierung...`,
        emotion: 'wise' as const,
        confidence: 95,
        codeSnippets: [
          {
            language: 'python',
            code: `from typing import List, Optional, Callable\nfrom dataclasses import dataclass\nfrom functools import lru_cache\nimport time\n\n@dataclass\nclass PerformanceMetrics:\n    execution_time: float\n    memory_usage: int\n    complexity: str\n\nclass OptimizedSolver:\n    def __init__(self, cache_size: int = 1000):\n        self.cache_size = cache_size\n        self.metrics = []\n    \n    @lru_cache(maxsize=1000)\n    def solve_optimized(self, problem_data: tuple) -> tuple:\n        """\n        Optimierte Lösung mit Memoization\n        Zeit-Komplexität: O(n log n)\n        Raum-Komplexität: O(n)\n        """\n        start_time = time.perf_counter()\n        \n        # Algorithmus-Implementierung\n        result = self._core_algorithm(problem_data)\n        \n        execution_time = time.perf_counter() - start_time\n        self._record_metrics(execution_time, len(problem_data))\n        \n        return result\n    \n    def _core_algorithm(self, data: tuple):\n        # Hier würde der tatsächliche Algorithmus stehen\n        return sorted(data, key=lambda x: x.priority)\n    \n    def _record_metrics(self, time: float, size: int):\n        metrics = PerformanceMetrics(\n            execution_time=time,\n            memory_usage=size * 8,  # Approximation\n            complexity=\"O(n log n)\"\n        )\n        self.metrics.append(metrics)`,
            explanation: 'Diese Implementierung kombiniert algorithmische Effizienz mit Performance-Monitoring und Caching für optimale Ergebnisse.',
            title: 'Optimized Algorithm with Metrics',
            complexity: 'advanced' as const,
            tags: ['Algorithm', 'Performance', 'Python', 'Optimization'],
            runnable: true
          }
        ],
        suggestions: [
          'Erkläre Big-O Notation',
          'Zeige alternative Algorithmen',
          'Performance-Vergleich',
          'Memory-Optimierung'
        ]
      }
    ]

    const randomResponse = enhancedResponses[Math.floor(Math.random() * enhancedResponses.length)]
    
    const assistantMessage: ChatMessage = {
      id: Date.now().toString() + '_response',
      role: 'assistant',
      content: randomResponse.content,
      personality: selectedPersonality.name,
      emotion: randomResponse.emotion,
      codeSnippets: randomResponse.codeSnippets,
      suggestions: randomResponse.suggestions,
      timestamp: new Date().toISOString(),
      confidence: randomResponse.confidence,
      errorAnalysis: randomResponse.errorAnalysis,
      citations: randomResponse.citations,
      followUp: randomResponse.followUp
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: 'Datei zu groß',
        description: 'Bitte wähle eine Datei unter 10MB',
        variant: 'destructive'
      })
      return
    }

    // Simulate file analysis
    const analysisMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `📊 **Datei-Analyse: ${file.name}**\n\nIch analysiere deine Datei und erstelle einen detaillierten Bericht...`,
      timestamp: new Date().toISOString(),
      personality: selectedPersonality?.name,
      emotion: 'analytical',
      confidence: 85,
      attachments: [{
        type: 'file',
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      }]
    }

    setMessages(prev => [...prev, analysisMessage])
    
    toast({
      title: 'Datei hochgeladen',
      description: `${file.name} wird analysiert...`
    })
  }

  const toggleVoiceChat = () => {
    setIsVoiceActive(!isVoiceActive)
    if (!isVoiceActive) {
      toast({
        title: 'Sprach-Chat aktiviert',
        description: 'Klicke auf das Mikrofon um zu sprechen'
      })
    }
  }

  const saveCurrentChat = () => {
    const chatData = {
      id: Date.now().toString(),
      title: `Chat mit ${selectedPersonality?.name}`,
      date: new Date().toISOString(),
      messages: messages.length,
      personality: selectedPersonality?.name,
      data: messages
    }
    setSavedChats(prev => [chatData, ...prev])
    toast({
      title: 'Chat gespeichert',
      description: 'Der Chat wurde in deiner Bibliothek gespeichert'
    })
  }

  const rateMessage = (messageId: string, rating: 'helpful' | 'not_helpful') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback: rating } : msg
    ))
    toast({
      title: 'Feedback gespeichert',
      description: 'Danke für dein Feedback! Es hilft uns zu verbessern.'
    })
  }

  const getPersonalityIcon = (personality: AIPersonality) => {
    switch (personality.role.toLowerCase()) {
      case 'prophet': return <Crown className="h-4 w-4" />
      case 'mentor': return <Lightbulb className="h-4 w-4" />
      case 'reviewer': return <Target className="h-4 w-4" />
      case 'guide': return <BookOpen className="h-4 w-4" />
      case 'architect': return <Brain className="h-4 w-4" />
      case 'visionary': return <Eye className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'wise': return 'from-yellow-500/20 to-orange-600/20 border-yellow-500/30'
      case 'encouraging': return 'from-green-500/20 to-emerald-600/20 border-green-500/30'
      case 'challenging': return 'from-red-500/20 to-pink-600/20 border-red-500/30'
      case 'mystical': return 'from-purple-500/20 to-indigo-600/20 border-purple-500/30'
      case 'analytical': return 'from-blue-500/20 to-cyan-600/20 border-blue-500/30'
      default: return 'from-gray-500/20 to-slate-600/20 border-gray-500/30'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'text-gray-600 bg-gray-100'
      case 'premium': return 'text-yellow-600 bg-yellow-100'
      case 'enterprise': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const clearChat = () => {
    setMessages([])
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'system',
        content: '🌟 **Neuer Chat gestartet**\n\nBereit für die nächste Coding-Session? Stelle mir deine Fragen!',
        timestamp: new Date().toISOString(),
        emotion: 'mystical',
        confidence: 100
      }
      setMessages([welcomeMessage])
    }, 100)
  }

  const filteredPersonalities = personalities.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || 
                           p.tier === filterCategory ||
                           p.role.toLowerCase() === filterCategory
    return matchesSearch && matchesCategory
  })

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
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleVoiceChat}
                    className={isVoiceActive ? 'bg-green-100 text-green-700' : ''}
                  >
                    {isVoiceActive ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isVoiceActive ? 'Sprach-Chat deaktivieren' : 'Sprach-Chat aktivieren'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="outline" size="sm" onClick={saveCurrentChat}>
              <Save className="h-3 w-3 mr-1" />
              Speichern
            </Button>
            
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>AI-Mentor Einstellungen</DialogTitle>
                  <DialogDescription>
                    Passe die KI-Parameter an deine Bedürfnisse an
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Modell</label>
                    <Select value={modelSettings.model} onValueChange={(value) => setModelSettings(prev => ({...prev, model: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claude-3-opus">Claude 3 Opus (Beste Qualität)</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet (Ausgewogen)</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Schnell)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Kreativität: {modelSettings.temperature}</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={modelSettings.temperature}
                      onChange={(e) => setModelSettings(prev => ({...prev, temperature: parseFloat(e.target.value)}))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Max. Tokens: {modelSettings.maxTokens}</label>
                    <input
                      type="range"
                      min="512"
                      max="4096"
                      step="256"
                      value={modelSettings.maxTokens}
                      onChange={(e) => setModelSettings(prev => ({...prev, maxTokens: parseInt(e.target.value)}))}
                      className="w-full"
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm" onClick={clearChat}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Neu
            </Button>
          </div>
        </div>
      </CardHeader>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="mentors" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Mentoren
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                Verlauf
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Analyse
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 flex flex-col m-0">
            {/* Selected Personality Info */}
            {selectedPersonality && (
              <div className="px-6 py-3 bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-blue-200">
                    <AvatarImage src={selectedPersonality.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {selectedPersonality.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{selectedPersonality.name}</span>
                      {getPersonalityIcon(selectedPersonality)}
                      <Badge className={getTierColor(selectedPersonality.tier)}>
                        {selectedPersonality.tier}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs">{selectedPersonality.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedPersonality.description}</p>
                    <div className="flex gap-1 mt-1">
                      {selectedPersonality.specialties.slice(0, 3).map(specialty => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>Antwortzeit: {selectedPersonality.responseTime}</div>
                    <div>XP Bonus: +{selectedPersonality.xpBonus}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-6 py-4">
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 
                      message.role === 'system' ? 'justify-center' : 'justify-start'
                    }`}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-xl p-4 transition-all duration-300 relative",
                        message.role === 'user'
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : message.role === 'system'
                          ? "bg-gradient-to-r from-purple-500/20 to-indigo-600/20 border border-purple-500/30 text-center"
                          : cn("bg-gradient-to-r border backdrop-blur-sm", getEmotionColor(message.emotion))
                      )}
                    >
                      {/* Confidence Indicator */}
                      {message.role === 'assistant' && message.confidence && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="text-xs">
                            {message.confidence}% sicher
                          </Badge>
                        </div>
                      )}

                      {message.role === 'assistant' && message.personality && (
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {message.personality.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{message.personality}</span>
                          {message.emotion && (
                            <Badge variant="outline" className="text-xs">
                              {message.emotion}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div
                          className="text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: message.content
                              .replace(/\n/g, '<br/>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/🎆|🔥|🧠|⚡|🌟|🤖|📊/g, '<span class="text-blue-600">$&</span>')
                          }}
                        />
                      </div>

                      {/* Enhanced Code Snippets */}
                      {message.codeSnippets && message.codeSnippets.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {message.codeSnippets.map((snippet, index) => (
                            <motion.div 
                              key={index} 
                              className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex items-center justify-between p-3 bg-slate-800 border-b border-slate-700">
                                <div className="flex items-center gap-2">
                                  <Code className="h-4 w-4 text-green-400" />
                                  <Badge className="bg-slate-700 text-slate-200">
                                    {snippet.language}
                                  </Badge>
                                  {snippet.title && (
                                    <span className="text-xs text-slate-300">{snippet.title}</span>
                                  )}
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      snippet.complexity === 'beginner' ? 'border-green-500 text-green-400' :
                                      snippet.complexity === 'intermediate' ? 'border-yellow-500 text-yellow-400' :
                                      'border-red-500 text-red-400'
                                    }`}
                                  >
                                    {snippet.complexity}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Code kopieren
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  {onCodeSuggestion && (
                                    <Button
                                      size="sm"
                                      onClick={() => onCodeSuggestion(snippet.code)}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      <Zap className="h-3 w-3 mr-1" />
                                      Verwenden
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <pre className="text-xs font-mono p-4 overflow-x-auto text-green-400 leading-relaxed">
                                <code>{snippet.code}</code>
                              </pre>
                              {snippet.explanation && (
                                <div className="p-3 bg-blue-900/20 border-t border-slate-700">
                                  <p className="text-xs text-blue-300">
                                    💡 {snippet.explanation}
                                  </p>
                                  {snippet.tags && (
                                    <div className="flex gap-1 mt-2">
                                      {snippet.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                          #{tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Error Analysis */}
                      {message.errorAnalysis && (
                        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                            <span className="font-medium text-red-300">Error Analysis</span>
                            <Badge className={`text-xs ${
                              message.errorAnalysis.severity === 'high' ? 'bg-red-600' :
                              message.errorAnalysis.severity === 'medium' ? 'bg-yellow-600' :
                              'bg-green-600'
                            }`}>
                              {message.errorAnalysis.severity}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="font-medium text-red-300">Fixes:</span>
                              <ul className="list-disc list-inside ml-2 text-red-200">
                                {message.errorAnalysis.fixes.map((fix, i) => <li key={i}>{fix}</li>)}
                              </ul>
                            </div>
                            <div>
                              <span className="font-medium text-red-300">Prevention:</span>
                              <ul className="list-disc list-inside ml-2 text-red-200">
                                {message.errorAnalysis.prevention.map((prev, i) => <li key={i}>{prev}</li>)}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Enhanced Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-medium mb-2 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Vorschläge:
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
                                  className="text-xs h-auto py-1 px-2 hover:bg-blue-50"
                                  onClick={() => setCurrentMessage(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-up Questions */}
                      {message.followUp && message.followUp.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                          <p className="text-xs font-medium mb-2 text-blue-300">Follow-up:</p>
                          <div className="space-y-1">
                            {message.followUp.map((question, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                className="text-xs h-auto py-1 px-2 text-blue-300 hover:text-blue-200 hover:bg-blue-800/20 justify-start w-full"
                                onClick={() => setCurrentMessage(question)}
                              >
                                <HelpCircle className="h-3 w-3 mr-1" />
                                {question}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Citations */}
                      {message.citations && message.citations.length > 0 && (
                        <div className="mt-4 text-xs">
                          <p className="font-medium mb-1">Quellen:</p>
                          <ul className="space-y-1">
                            {message.citations.map((citation, index) => (
                              <li key={index} className="text-blue-600 hover:underline cursor-pointer">
                                {citation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Message Rating */}
                      {message.role === 'assistant' && (
                        <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-current/20">
                          <span className="text-xs opacity-70">War das hilfreich?</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => rateMessage(message.id, 'helpful')}
                            className={`p-1 h-auto ${message.feedback === 'helpful' ? 'text-green-600' : 'text-gray-400'}`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => rateMessage(message.id, 'not_helpful')}
                            className={`p-1 h-auto ${message.feedback === 'not_helpful' ? 'text-red-600' : 'text-gray-400'}`}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
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
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
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
                        <span className="text-xs text-blue-600">
                          {selectedPersonality?.name} denkt nach...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Enhanced Message Input */}
            <div className="border-t bg-background/80 backdrop-blur-sm p-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={selectedPersonality ? `Frage ${selectedPersonality.name}...` : 'Wähle zuerst einen Mentor...'}
                    className="min-h-[60px] max-h-[120px] pr-24 resize-none"
                    disabled={loading || !selectedPersonality}
                  />
                  
                  {/* Input Tools */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.md,.txt,.json,.html,.css,.php,.go,.rs,.rb"
                      className="hidden"
                    />
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-6 w-6 p-0"
                          >
                            <Paperclip className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Datei hochladen
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleVoiceChat}
                            className={`h-6 w-6 p-0 ${isListening ? 'text-red-600 animate-pulse' : 'text-gray-400'}`}
                            disabled={!selectedPersonality}
                          >
                            {isListening ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isListening ? 'Aufnahme stoppen' : 'Sprach-Chat (Beta)'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <Button
                  onClick={sendMessage}
                  disabled={loading || !currentMessage.trim() || !selectedPersonality}
                  size="icon"
                  className="shrink-0 h-[60px] w-[60px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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

          {/* Mentors Tab */}
          <TabsContent value="mentors" className="flex-1 m-0 p-6">
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-2">
                <Input
                  placeholder="Mentoren suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle</SelectItem>
                    <SelectItem value="free">Kostenlos</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <ScrollArea className="h-96">
                <div className="grid gap-4">
                  {filteredPersonalities.map(personality => (
                    <Card 
                      key={personality.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedPersonality?.id === personality.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedPersonality(personality)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-blue-200">
                            <AvatarImage src={personality.avatar} />
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {personality.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{personality.name}</h3>
                              {getPersonalityIcon(personality)}
                              <Badge className={getTierColor(personality.tier)}>
                                {personality.tier}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs">{personality.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{personality.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {personality.expertise.slice(0, 4).map(skill => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="text-right text-xs text-muted-foreground">
                            <div>⚡ {personality.responseTime}</div>
                            <div>🎯 +{personality.xpBonus} XP</div>
                            <div>💬 {personality.languages.length} Sprachen</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="flex-1 m-0 p-6">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {chatHistory.map(chat => (
                  <Card key={chat.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{chat.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(chat.date).toLocaleDateString('de-DE')} • {chat.messages} Nachrichten
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Archive className="h-3 w-3 mr-1" />
                          Laden
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="flex-1 m-0 p-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Code-Analyse Tools</CardTitle>
                  <CardDescription>
                    Erweiterte Analyse-Features für deinen Code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" disabled>
                    <FileCode className="h-4 w-4 mr-2" />
                    Projekt-Analyse (Coming Soon)
                  </Button>
                  <Button className="w-full justify-start" disabled>
                    <GitBranch className="h-4 w-4 mr-2" />
                    Git-Integration (Coming Soon)
                  </Button>
                  <Button className="w-full justify-start" disabled>
                    <Target className="h-4 w-4 mr-2" />
                    Performance-Analyse (Coming Soon)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  )
}