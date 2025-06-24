'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { 
  Users, 
  Video, 
  Plus, 
  Clock, 
  Crown, 
  Mic, 
  MicOff, 
  VideoIcon, 
  VideoOff,
  Monitor,
  MessageCircle,
  UserPlus,
  Settings,
  Play,
  Pause,
  Loader2,
  Calendar,
  MapPin,
  Zap,
  Heart,
  Share2,
  Code,
  GitBranch,
  FileCode,
  Lightbulb,
  Target,
  Award,
  Star,
  Eye,
  Send,
  Copy,
  Download,
  Upload,
  Presentation,
  Monitor as Screen,
  PenTool,
  MousePointer,
  Layers,
  Grid,
  Maximize,
  Minimize,
  RotateCcw,
  Save,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Info,
  HelpCircle,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface CollaborationSession {
  id: string
  name: string
  description: string
  host: {
    name: string
    avatar: string
    role: string
  }
  participants: Array<{
    id: string
    name: string
    avatar: string
    role: string
    status: 'online' | 'away' | 'busy'
    permissions: string[]
  }>
  status: 'active' | 'scheduled' | 'paused' | 'ended'
  startTime: string
  duration: number
  maxParticipants: number
  topic: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  language: string
  tools: string[]
  sharedCode?: {
    files: Array<{
      name: string
      language: string
      content: string
      lastModified: string
      author: string
    }>
    activeFile?: string
  }
  whiteboard?: {
    elements: any[]
    collaborators: string[]
  }
  chat: Array<{
    id: string
    author: string
    message: string
    timestamp: string
    type: 'message' | 'system' | 'code'
  }>
  recordings?: string[]
  notes?: string
}

interface AdvancedCollaborationSuiteProps {
  currentUser: {
    id: string
    name: string
    avatar: string
    tier: string
  }
  onJoinSession?: (sessionId: string) => void
  onCreateSession?: (sessionData: any) => void
  className?: string
}

export function AdvancedCollaborationSuite({
  currentUser,
  onJoinSession = () => {},
  onCreateSession = () => {},
  className = ''
}: AdvancedCollaborationSuiteProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('sessions')
  const [sessions, setSessions] = useState<CollaborationSession[]>([])
  const [currentSession, setCurrentSession] = useState<CollaborationSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTag, setFilterTag] = useState('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newSession, setNewSession] = useState({
    name: '',
    description: '',
    topic: '',
    difficulty: 'intermediate' as const,
    language: 'JavaScript',
    maxParticipants: 8,
    duration: 60,
    tags: [] as string[],
    isPublic: true,
    recordSession: false
  })
  const [chatMessage, setChatMessage] = useState('')
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [activeTool, setActiveTool] = useState<'pointer' | 'pen' | 'text' | 'shape'>('pointer')

  // Mock sessions data
  const mockSessions: CollaborationSession[] = [
    {
      id: '1',
      name: 'React Hooks Deep Dive',
      description: 'Exploring advanced React Hooks patterns and custom hooks development',
      host: {
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg',
        role: 'Prophet'
      },
      participants: [
        {
          id: '1',
          name: 'Alex Rodriguez',
          avatar: '/avatars/alex.jpg',
          role: 'Architect',
          status: 'online',
          permissions: ['write', 'voice', 'video']
        },
        {
          id: '2',
          name: 'Maria Kim',
          avatar: '/avatars/maria.jpg',
          role: 'Practitioner',
          status: 'online',
          permissions: ['write', 'voice']
        }
      ],
      status: 'active',
      startTime: '2024-01-20T14:00:00Z',
      duration: 90,
      maxParticipants: 12,
      topic: 'Advanced React Patterns',
      tags: ['React', 'Hooks', 'JavaScript', 'Frontend'],
      difficulty: 'intermediate',
      language: 'JavaScript',
      tools: ['VS Code', 'CodeSandbox', 'Whiteboard'],
      sharedCode: {
        files: [
          {
            name: 'useAdvancedState.js',
            language: 'javascript',
            content: 'const useAdvancedState = (initialState) => {\n  // Implementation here\n}',
            lastModified: '2024-01-20T14:30:00Z',
            author: 'Sarah Chen'
          }
        ],
        activeFile: 'useAdvancedState.js'
      },
      chat: [
        {
          id: '1',
          author: 'Sarah Chen',
          message: 'Welcome everyone! Let\'s start with custom hooks basics.',
          timestamp: '2024-01-20T14:05:00Z',
          type: 'message'
        },
        {
          id: '2',
          author: 'Alex Rodriguez',
          message: 'Great! I\'ve been struggling with useEffect dependencies.',
          timestamp: '2024-01-20T14:06:00Z',
          type: 'message'
        }
      ]
    },
    {
      id: '2',
      name: 'TypeScript Mastery Workshop',
      description: 'Advanced TypeScript concepts, generics, and type manipulation',
      host: {
        name: 'David Wilson',
        avatar: '/avatars/david.jpg',
        role: 'Architect'
      },
      participants: [
        {
          id: '3',
          name: 'Emily Davis',
          avatar: '/avatars/emily.jpg',
          role: 'Practitioner',
          status: 'online',
          permissions: ['write', 'voice', 'video']
        }
      ],
      status: 'active',
      startTime: '2024-01-20T15:30:00Z',
      duration: 120,
      maxParticipants: 8,
      topic: 'Type Safety & Advanced Types',
      tags: ['TypeScript', 'Types', 'Generic Programming'],
      difficulty: 'advanced',
      language: 'TypeScript',
      tools: ['VS Code', 'TypeScript Playground'],
      chat: []
    },
    {
      id: '3',
      name: 'AI-Assisted Code Review',
      description: 'Learn to use AI tools for effective code reviews and quality assurance',
      host: {
        name: 'Lisa Zhang',
        avatar: '/avatars/lisa.jpg',
        role: 'Prophet'
      },
      participants: [],
      status: 'scheduled',
      startTime: '2024-01-20T18:00:00Z',
      duration: 60,
      maxParticipants: 15,
      topic: 'Code Quality & AI Tools',
      tags: ['AI', 'Code Review', 'Quality Assurance'],
      difficulty: 'beginner',
      language: 'Multi-Language',
      tools: ['AI Code Assistant', 'GitHub', 'VS Code'],
      chat: []
    }
  ]

  useEffect(() => {
    setSessions(mockSessions)
  }, [])

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFilter = filterTag === 'all' || session.tags.includes(filterTag)
    return matchesSearch && matchesFilter
  })

  const handleJoinSession = async (session: CollaborationSession) => {
    if (session.participants.length >= session.maxParticipants) {
      toast({
        title: 'Session voll',
        description: 'Diese Session hat bereits die maximale Teilnehmerzahl erreicht.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setCurrentSession(session)
    onJoinSession(session.id)
    
    toast({
      title: 'Session beigetreten',
      description: `Du bist der Session "${session.name}" beigetreten.`
    })
    
    setLoading(false)
  }

  const handleCreateSession = async () => {
    if (!newSession.name || !newSession.description) {
      toast({
        title: 'Fehlende Angaben',
        description: 'Bitte fülle alle Pflichtfelder aus.',
        variant: 'destructive'
      })
      return
    }

    const sessionData = {
      ...newSession,
      id: Date.now().toString(),
      host: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: currentUser.tier
      },
      participants: [],
      status: 'active' as const,
      startTime: new Date().toISOString(),
      chat: [],
      tools: ['editor', 'whiteboard', 'voice', 'video']
    }

    setSessions(prev => [sessionData as CollaborationSession, ...prev])
    onCreateSession(sessionData)
    setShowCreateDialog(false)
    setNewSession({
      name: '',
      description: '',
      topic: '',
      difficulty: 'intermediate',
      language: 'JavaScript',
      maxParticipants: 8,
      duration: 60,
      tags: [],
      isPublic: true,
      recordSession: false
    })

    toast({
      title: 'Session erstellt',
      description: 'Deine Kollaborations-Session wurde erfolgreich erstellt!'
    })
  }

  const sendChatMessage = () => {
    if (!chatMessage.trim() || !currentSession) return

    const newMessage = {
      id: Date.now().toString(),
      author: currentUser.name,
      message: chatMessage,
      timestamp: new Date().toISOString(),
      type: 'message' as const
    }

    setCurrentSession(prev => prev ? {
      ...prev,
      chat: [...prev.chat, newMessage]
    } : null)

    setChatMessage('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'ended': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatSessionTime = (startTime: string, duration: number) => {
    const start = new Date(startTime)
    const end = new Date(start.getTime() + duration * 60000)
    return `${start.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`
  }

  const getParticipantStatus = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  // If in a session, show the session interface
  if (currentSession) {
    return (
      <Card className={cn("h-[800px] flex flex-col", className)}>
        {/* Session Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentSession(null)}
              >
                ← Zurück
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  {currentSession.name}
                  <Badge className={getStatusColor(currentSession.status)}>
                    {currentSession.status === 'active' ? 'LIVE' : currentSession.status}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {currentSession.description}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(currentSession.difficulty)}>
                {currentSession.difficulty}
              </Badge>
              <Badge variant="outline">
                {currentSession.language}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatSessionTime(currentSession.startTime, currentSession.duration)}
              </span>
            </div>
          </div>
          
          {/* Participants */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {currentSession.participants.length + 1}/{currentSession.maxParticipants} Teilnehmer
              </span>
            </div>
            
            <div className="flex -space-x-2">
              {/* Host */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar className="h-8 w-8 border-2 border-white relative">
                      <AvatarImage src={currentSession.host.avatar} />
                      <AvatarFallback>{currentSession.host.name.charAt(0)}</AvatarFallback>
                      <Crown className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500" />
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    {currentSession.host.name} (Host)
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Participants */}
              {currentSession.participants.map(participant => (
                <TooltipProvider key={participant.id}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Avatar className="h-8 w-8 border-2 border-white relative">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${getParticipantStatus(participant.status)}`} />
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      {participant.name} ({participant.status})
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </CardHeader>

        {/* Session Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Collaboration Area */}
          <div className="flex-1 flex flex-col">
            <Tabs defaultValue="code" className="flex-1 flex flex-col">
              <div className="px-4 pt-4">
                <TabsList>
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Code Editor
                  </TabsTrigger>
                  <TabsTrigger value="whiteboard" className="flex items-center gap-2">
                    <PenTool className="h-4 w-4" />
                    Whiteboard
                  </TabsTrigger>
                  <TabsTrigger value="screen" className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Screen Share
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="code" className="flex-1 m-0 p-4">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4" />
                        <span className="font-medium">
                          {currentSession.sharedCode?.activeFile || 'Neue Datei'}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {currentSession.language}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Save className="h-3 w-3 mr-1" />
                          Speichern
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="h-96">
                    <div className="h-full bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400">
                      <div className="text-slate-400 mb-2">// Geteilter Code-Editor</div>
                      <div className="text-blue-400">const</div>
                      <span className="text-yellow-400"> collaborativeFunction</span>
                      <span className="text-white"> = (</span>
                      <span className="text-orange-400">participants</span>
                      <span className="text-white">) =&gt; {`{`}</span>
                      <div className="ml-4">
                        <div className="text-slate-400">// Hier können alle Teilnehmer gemeinsam coden</div>
                        <div className="text-purple-400">return</div>
                        <span className="text-green-400"> "Kollaboratives Coding ist awesome!"</span>
                        <span className="text-white">;</span>
                      </div>
                      <div className="text-white">{`}`}</div>
                      
                      {/* Simulated cursors of other participants */}
                      <div className="relative">
                        <div className="absolute top-0 left-20 w-0.5 h-5 bg-blue-500 animate-pulse" />
                        <div className="absolute top-0 left-20 text-xs text-blue-500 bg-blue-100 px-1 rounded">
                          Alex
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="whiteboard" className="flex-1 m-0 p-4">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PenTool className="h-4 w-4" />
                        <span className="font-medium">Kollaboratives Whiteboard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Whiteboard Tools */}
                        <Button 
                          variant={activeTool === 'pointer' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setActiveTool('pointer')}
                        >
                          <MousePointer className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant={activeTool === 'pen' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setActiveTool('pen')}
                        >
                          <PenTool className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="h-96">
                    <div className="h-full bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Grid className="h-12 w-12 mx-auto mb-2" />
                        <p>Kollaboratives Whiteboard</p>
                        <p className="text-sm">Zeichne, skizziere und erkläre gemeinsam mit deinem Team</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="screen" className="flex-1 m-0 p-4">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        <span className="font-medium">Screen Sharing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant={isScreenSharing ? 'destructive' : 'default'} 
                          onClick={() => setIsScreenSharing(!isScreenSharing)}
                        >
                          {isScreenSharing ? (
                            <>
                              <Monitor className="h-3 w-3 mr-1" />
                              Sharing beenden
                            </>
                          ) : (
                            <>
                              <Share2 className="h-3 w-3 mr-1" />
                              Screen teilen
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="h-96">
                    <div className="h-full bg-black rounded-lg flex items-center justify-center">
                      {isScreenSharing ? (
                        <div className="text-center text-white">
                          <Presentation className="h-12 w-12 mx-auto mb-2" />
                          <p>Du teilst deinen Bildschirm</p>
                          <p className="text-sm text-gray-400">Alle Teilnehmer können deinen Bildschirm sehen</p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400">
                          <Screen className="h-12 w-12 mx-auto mb-2" />
                          <p>Kein Screen Sharing aktiv</p>
                          <p className="text-sm">Klicke "Screen teilen" um deinen Bildschirm zu teilen</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar: Video & Chat */}
          <div className="w-80 border-l bg-muted/30 flex flex-col">
            {/* Video Area */}
            <div className="p-4 border-b">
              <div className="space-y-3">
                {/* Self Video */}
                <div className="relative">
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    {isVideoOn ? (
                      <div className="text-white text-center">
                        <Video className="h-8 w-8 mx-auto mb-1" />
                        <p className="text-xs">Du ({currentUser.name})</p>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center">
                        <VideoOff className="h-8 w-8 mx-auto mb-1" />
                        <p className="text-xs">Video aus</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Other Participants */}
                {currentSession.participants.slice(0, 3).map(participant => (
                  <div key={participant.id} className="relative">
                    <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <Avatar className="h-8 w-8 mx-auto mb-1">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="text-xs">{participant.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Video Controls */}
              <div className="flex justify-center gap-2 mt-3">
                <Button 
                  variant={isVideoOn ? 'default' : 'destructive'} 
                  size="sm"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? <VideoIcon className="h-3 w-3" /> : <VideoOff className="h-3 w-3" />}
                </Button>
                <Button 
                  variant={isAudioOn ? 'default' : 'destructive'} 
                  size="sm"
                  onClick={() => setIsAudioOn(!isAudioOn)}
                >
                  {isAudioOn ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            {/* Chat */}
            <div className="flex-1 flex flex-col">
              <div className="p-3 border-b bg-background">
                <h3 className="font-medium flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Session Chat
                </h3>
              </div>
              
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  {currentSession.chat.map(message => (
                    <div key={message.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{message.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm bg-muted p-2 rounded">{message.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nachricht eingeben..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={sendChatMessage} disabled={!chatMessage.trim()}>
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Main collaboration suite interface
  return (
    <Card className={cn("h-[800px] flex flex-col", className)}>
      <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Advanced Collaboration Suite
            </CardTitle>
            <CardDescription>
              Professionelle Tools für Pair Programming, Code Reviews und Team-Sessions
            </CardDescription>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Session erstellen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Neue Kollaborations-Session</DialogTitle>
                <DialogDescription>
                  Erstelle eine neue Session für Pair Programming, Code Reviews oder Workshops
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Session Name *</label>
                    <Input
                      placeholder="z.B. React Hooks Workshop"
                      value={newSession.name}
                      onChange={(e) => setNewSession({...newSession, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Thema</label>
                    <Input
                      placeholder="z.B. Advanced React Patterns"
                      value={newSession.topic}
                      onChange={(e) => setNewSession({...newSession, topic: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Beschreibung *</label>
                  <Textarea
                    placeholder="Beschreibe was in dieser Session behandelt wird..."
                    value={newSession.description}
                    onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Schwierigkeit</label>
                    <Select 
                      value={newSession.difficulty} 
                      onValueChange={(value: any) => setNewSession({...newSession, difficulty: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Anfänger</SelectItem>
                        <SelectItem value="intermediate">Fortgeschritten</SelectItem>
                        <SelectItem value="advanced">Experte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sprache</label>
                    <Select 
                      value={newSession.language} 
                      onValueChange={(value) => setNewSession({...newSession, language: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JavaScript">JavaScript</SelectItem>
                        <SelectItem value="TypeScript">TypeScript</SelectItem>
                        <SelectItem value="Python">Python</SelectItem>
                        <SelectItem value="React">React</SelectItem>
                        <SelectItem value="Node.js">Node.js</SelectItem>
                        <SelectItem value="Multi-Language">Multi-Language</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max. Teilnehmer</label>
                    <Input
                      type="number"
                      min="2"
                      max="20"
                      value={newSession.maxParticipants}
                      onChange={(e) => setNewSession({...newSession, maxParticipants: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Dauer (Minuten)</label>
                  <Input
                    type="number"
                    min="15"
                    max="480"
                    value={newSession.duration}
                    onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleCreateSession}>
                    Session erstellen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sessions" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Live Sessions
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Geplant
              </TabsTrigger>
              <TabsTrigger value="recordings" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Aufzeichnungen
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Tools
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Search and Filter */}
          <div className="px-6 py-4 border-b">
            <div className="flex gap-2">
              <Input
                placeholder="Sessions durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Tags</SelectItem>
                  <SelectItem value="React">React</SelectItem>
                  <SelectItem value="TypeScript">TypeScript</SelectItem>
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="sessions" className="flex-1 m-0 p-6">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {filteredSessions.filter(s => s.status === 'active').map(session => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => handleJoinSession(session)}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                                {session.name}
                              </h3>
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                              <Badge className={getStatusColor(session.status)}>
                                LIVE
                              </Badge>
                              <Badge className={getDifficultyColor(session.difficulty)}>
                                {session.difficulty}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">{session.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatSessionTime(session.startTime, session.duration)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {session.participants.length + 1}/{session.maxParticipants}
                              </div>
                              <div className="flex items-center gap-1">
                                <Code className="h-4 w-4" />
                                {session.language}
                              </div>
                            </div>
                            
                            <div className="flex gap-1 mt-3">
                              {session.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8 border-2 border-white">
                                <AvatarImage src={session.host.avatar} />
                                <AvatarFallback>{session.host.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="text-right">
                                <div className="text-sm font-medium">{session.host.name}</div>
                                <div className="text-xs text-muted-foreground">{session.host.role}</div>
                              </div>
                            </div>
                            
                            <Button 
                              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                              disabled={loading || session.participants.length >= session.maxParticipants}
                            >
                              {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Play className="h-4 w-4 mr-2" />
                              )}
                              {session.participants.length >= session.maxParticipants ? 'Voll' : 'Beitreten'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                
                {filteredSessions.filter(s => s.status === 'active').length === 0 && (
                  <div className="text-center py-12">
                    <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold mb-2">Keine aktiven Sessions</p>
                    <p className="text-muted-foreground">Erstelle eine neue Session oder warte auf geplante Sessions</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="scheduled" className="flex-1 m-0 p-6">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {filteredSessions.filter(s => s.status === 'scheduled').map(session => (
                  <Card key={session.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{session.name}</h3>
                            <Badge className={getStatusColor(session.status)}>
                              Geplant
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{session.description}</p>
                          <div className="text-sm text-muted-foreground">
                            Startet: {formatSessionTime(session.startTime, session.duration)}
                          </div>
                        </div>
                        <Button variant="outline">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Anmelden
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="recordings" className="flex-1 m-0 p-6">
            <div className="text-center py-12">
              <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold mb-2">Session-Aufzeichnungen</p>
              <p className="text-muted-foreground">Feature wird bald verfügbar sein!</p>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="flex-1 m-0 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Code Editor
                  </CardTitle>
                  <CardDescription>
                    Kollaborativer Code-Editor mit Live-Sync
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Standalone öffnen
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PenTool className="h-5 w-5" />
                    Whiteboard
                  </CardTitle>
                  <CardDescription>
                    Interaktives Whiteboard für Diagramme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Whiteboard öffnen
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    Git Integration
                  </CardTitle>
                  <CardDescription>
                    Synchronisiere mit GitHub Repositories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" disabled>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Coming Soon
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