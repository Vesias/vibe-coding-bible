'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  BookOpen, 
  Code, 
  Trophy, 
  Star,
  Users,
  Zap,
  Crown,
  Plus,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Gift,
  Award,
  Target,
  Flame,
  Send,
  PlusCircle,
  Edit,
  Trash2,
  Flag,
  Bookmark,
  Download,
  Copy,
  CheckCircle
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface CommunityPost {
  id: string
  type: 'code_snippet' | 'tutorial' | 'success_story' | 'question' | 'showcase' | 'ai_tip'
  title: string
  content: string
  author: {
    name: string
    avatar: string
    rank: string
    xp: number
    verified: boolean
  }
  tags: string[]
  likes: number
  comments: number
  shares: number
  views: number
  createdAt: string
  featured?: boolean
  solved?: boolean
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  codeLanguage?: string
}

interface CommunityStats {
  totalMembers: number
  activeToday: number
  postsToday: number
  helpfulAnswers: number
}

interface LiveEvent {
  id: string
  title: string
  description: string
  host: string
  startTime: string
  duration: number
  participants: number
  maxParticipants: number
  tags: string[]
  live: boolean
}

export function EnhancedCommunityHub() {
  const [activeTab, setActiveTab] = useState('feed')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [stats, setStats] = useState<CommunityStats>({
    totalMembers: 12847,
    activeToday: 2134,
    postsToday: 89,
    helpfulAnswers: 1567
  })
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newPost, setNewPost] = useState({
    type: 'question' as CommunityPost['type'],
    title: '',
    content: '',
    tags: [] as string[],
    codeLanguage: ''
  })

  // Enhanced mock data
  const mockPosts: CommunityPost[] = [
    {
      id: '1',
      type: 'success_story',
      title: 'Von 0 auf Prophet: Meine 6-Monats-Reise mit der Vibe Coding Bible',
      content: 'Als kompletter Anfänger habe ich mit den 10 heiligen Geboten angefangen...',
      author: {
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg',
        rank: 'Prophet',
        xp: 15420,
        verified: true
      },
      tags: ['Success Story', 'Anfänger', 'Full Stack', 'Career Change'],
      likes: 234,
      comments: 45,
      shares: 23,
      views: 1250,
      createdAt: '2024-01-20T08:00:00Z',
      featured: true
    },
    {
      id: '2',
      type: 'code_snippet',
      title: 'Divine React Hook für AI Code Reviews',
      content: 'const useAICodeReview = (code: string) => {\n  const [review, setReview] = useState(null)\n  // Sacred implementation...\n}',
      author: {
        name: 'Marcus Rodriguez',
        avatar: '/avatars/marcus.jpg',
        rank: 'Architect',
        xp: 8750,
        verified: true
      },
      tags: ['React', 'Hooks', 'AI', 'TypeScript', 'Code Review'],
      likes: 89,
      comments: 12,
      shares: 8,
      views: 445,
      createdAt: '2024-01-20T06:30:00Z',
      codeLanguage: 'typescript',
      difficulty: 'intermediate'
    },
    {
      id: '3',
      type: 'question',
      title: 'Wie optimiere ich AI-Prompts für komplexe Codegeneration?',
      content: 'Ich arbeite an einem komplexen React-Projekt und möchte AI effektiver nutzen...',
      author: {
        name: 'Elena Vasquez',
        avatar: '/avatars/elena.jpg',
        rank: 'Practitioner',
        xp: 6200,
        verified: false
      },
      tags: ['AI Prompting', 'React', 'Best Practices', 'Hilfe'],
      likes: 23,
      comments: 18,
      shares: 5,
      views: 156,
      createdAt: '2024-01-20T05:15:00Z',
      solved: false
    },
    {
      id: '4',
      type: 'ai_tip',
      title: 'Pro-Tipp: Multi-Context Prompting für bessere Ergebnisse',
      content: 'Hier ist eine Technik, die meine AI-Coding-Produktivität um 300% gesteigert hat...',
      author: {
        name: 'David Kim',
        avatar: '/avatars/david.jpg',
        rank: 'Prophet',
        xp: 22100,
        verified: true
      },
      tags: ['AI Prompting', 'Produktivität', 'Advanced', 'Tips'],
      likes: 167,
      comments: 28,
      shares: 42,
      views: 892,
      createdAt: '2024-01-19T20:00:00Z',
      featured: true,
      difficulty: 'advanced'
    },
    {
      id: '5',
      type: 'showcase',
      title: 'Meine erste SaaS App mit Claude Code in 2 Wochen!',
      content: 'Schaut euch meine neue App an: TaskMaster AI - komplett mit Claude Code entwickelt!',
      author: {
        name: 'Lisa Zhang',
        avatar: '/avatars/lisa.jpg',
        rank: 'Architect',
        xp: 9800,
        verified: true
      },
      tags: ['Showcase', 'SaaS', 'Claude Code', 'React', 'Full Stack'],
      likes: 145,
      comments: 32,
      shares: 19,
      views: 678,
      createdAt: '2024-01-19T16:45:00Z',
      difficulty: 'intermediate'
    }
  ]

  const liveEvents: LiveEvent[] = [
    {
      id: '1',
      title: 'Live: Advanced AI Prompting Workshop',
      description: 'Lerne die Geheimnisse effektiver AI-Prompts von einem Prophet',
      host: 'Marcus Rodriguez',
      startTime: '2024-01-20T19:00:00Z',
      duration: 90,
      participants: 47,
      maxParticipants: 50,
      tags: ['AI Prompting', 'Workshop', 'Live'],
      live: true
    },
    {
      id: '2',
      title: 'Community Code Review Session',
      description: 'Bringe dein Projekt mit und erhalte Feedback von der Community',
      host: 'Sarah Chen',
      startTime: '2024-01-20T20:30:00Z',
      duration: 60,
      participants: 23,
      maxParticipants: 30,
      tags: ['Code Review', 'Community', 'Feedback'],
      live: false
    }
  ]

  useEffect(() => {
    setPosts(mockPosts)
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = filterType === 'all' || post.type === filterType
    return matchesSearch && matchesType
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.likes + b.comments) - (a.likes + a.comments)
      case 'trending':
        return b.views - a.views
      case 'latest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const getTypeIcon = (type: CommunityPost['type']) => {
    switch (type) {
      case 'code_snippet': return <Code className="h-4 w-4" />
      case 'tutorial': return <BookOpen className="h-4 w-4" />
      case 'success_story': return <Trophy className="h-4 w-4" />
      case 'question': return <MessageCircle className="h-4 w-4" />
      case 'showcase': return <Star className="h-4 w-4" />
      case 'ai_tip': return <Zap className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: CommunityPost['type']) => {
    switch (type) {
      case 'code_snippet': return 'bg-blue-100 text-blue-800'
      case 'tutorial': return 'bg-green-100 text-green-800'
      case 'success_story': return 'bg-yellow-100 text-yellow-800'
      case 'question': return 'bg-purple-100 text-purple-800'
      case 'showcase': return 'bg-pink-100 text-pink-800'
      case 'ai_tip': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Prophet': return <Crown className="h-4 w-4 text-yellow-500" />
      case 'Architect': return <TrendingUp className="h-4 w-4 text-purple-500" />
      case 'Practitioner': return <Zap className="h-4 w-4 text-blue-500" />
      default: return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `vor ${days} Tag${days > 1 ? 'en' : ''}`
    if (hours > 0) return `vor ${hours} Stunde${hours > 1 ? 'n' : ''}`
    return 'vor wenigen Minuten'
  }

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) return
    
    const post: CommunityPost = {
      id: Date.now().toString(),
      type: newPost.type,
      title: newPost.title,
      content: newPost.content,
      author: {
        name: 'Du',
        avatar: '',
        rank: 'Practitioner',
        xp: 5000,
        verified: false
      },
      tags: newPost.tags,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 1,
      createdAt: new Date().toISOString(),
      codeLanguage: newPost.codeLanguage
    }
    
    setPosts([post, ...posts])
    setNewPost({ type: 'question', title: '', content: '', tags: [], codeLanguage: '' })
    setShowCreateDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Community Header with Stats */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                🎆 Divine Community Hub
              </CardTitle>
              <CardDescription className="text-lg">
                Verbinde dich mit über {stats.totalMembers.toLocaleString()} Coding-Propheten weltweit
              </CardDescription>
            </div>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Beitrag erstellen
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Neuen Beitrag erstellen</DialogTitle>
                  <DialogDescription>
                    Teile dein Wissen, stelle Fragen oder zeige deine Projekte
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Typ</label>
                      <Select value={newPost.type} onValueChange={(value: CommunityPost['type']) => setNewPost({...newPost, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="question">Frage</SelectItem>
                          <SelectItem value="code_snippet">Code Snippet</SelectItem>
                          <SelectItem value="tutorial">Tutorial</SelectItem>
                          <SelectItem value="showcase">Projekt Showcase</SelectItem>
                          <SelectItem value="success_story">Erfolgsgeschichte</SelectItem>
                          <SelectItem value="ai_tip">AI Tipp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {newPost.type === 'code_snippet' && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Programmiersprache</label>
                        <Select value={newPost.codeLanguage} onValueChange={(value) => setNewPost({...newPost, codeLanguage: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Wähle Sprache" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="javascript">JavaScript</SelectItem>
                            <SelectItem value="typescript">TypeScript</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="react">React</SelectItem>
                            <SelectItem value="nodejs">Node.js</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Titel</label>
                    <Input
                      placeholder="Gib deinem Beitrag einen aussagekräftigen Titel..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Inhalt</label>
                    <Textarea
                      placeholder="Beschreibe dein Anliegen, teile deinen Code oder erzähle deine Geschichte..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      rows={8}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags (kommagetrennt)</label>
                    <Input
                      placeholder="React, TypeScript, AI, Anfänger..."
                      onChange={(e) => setNewPost({...newPost, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)})}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Abbrechen
                    </Button>
                    <Button onClick={handleCreatePost} disabled={!newPost.title || !newPost.content}>
                      <Send className="h-4 w-4 mr-2" />
                      Veröffentlichen
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.totalMembers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Mitglieder</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.activeToday.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Heute aktiv</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.postsToday}</div>
              <div className="text-sm text-muted-foreground">Neue Beiträge</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.helpfulAnswers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Hilfreiche Antworten</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-4">
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Live Events
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Bestenliste
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Ressourcen
            </TabsTrigger>
          </TabsList>
          
          {/* Search and Filter */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Community durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Typen</SelectItem>
                <SelectItem value="question">Fragen</SelectItem>
                <SelectItem value="code_snippet">Code Snippets</SelectItem>
                <SelectItem value="tutorial">Tutorials</SelectItem>
                <SelectItem value="success_story">Erfolgsgeschichten</SelectItem>
                <SelectItem value="showcase">Showcases</SelectItem>
                <SelectItem value="ai_tip">AI Tipps</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Neueste</SelectItem>
                <SelectItem value="popular">Beliebt</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Feed Tab */}
        <TabsContent value="feed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-4">
              {sortedPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{post.author.name}</span>
                            {getRankIcon(post.author.rank)}
                            <Badge variant="secondary" className="text-xs">
                              {post.author.rank}
                            </Badge>
                            {post.author.verified && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {post.author.xp.toLocaleString()} XP • {formatTimeAgo(post.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {post.featured && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black">
                            ⭐ Featured
                          </Badge>
                        )}
                        <Badge className={getTypeColor(post.type)}>
                          {getTypeIcon(post.type)}
                          <span className="ml-1 text-xs">
                            {post.type === 'code_snippet' ? 'Code' :
                             post.type === 'success_story' ? 'Erfolg' :
                             post.type === 'ai_tip' ? 'AI Tipp' :
                             post.type === 'showcase' ? 'Showcase' :
                             post.type === 'tutorial' ? 'Tutorial' : 'Frage'}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3">
                        {post.content}
                      </p>
                    </div>

                    {/* Code Preview for Snippets */}
                    {post.type === 'code_snippet' && post.codeLanguage && (
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {post.codeLanguage}
                          </Badge>
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
                        </div>
                        <pre className="text-green-400 text-sm">
                          <code>{post.content}</code>
                        </pre>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-muted">
                          #{tag}
                        </Badge>
                      ))}
                      {post.difficulty && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            post.difficulty === 'beginner' ? 'border-green-500 text-green-700' :
                            post.difficulty === 'intermediate' ? 'border-yellow-500 text-yellow-700' :
                            'border-red-500 text-red-700'
                          }`}
                        >
                          {post.difficulty === 'beginner' ? '🟢 Anfänger' :
                           post.difficulty === 'intermediate' ? '🟡 Fortgeschritten' : '🔴 Experte'}
                        </Badge>
                      )}
                      {post.type === 'question' && (
                        <Badge 
                          variant="outline"
                          className={`text-xs ${post.solved ? 'border-green-500 text-green-700 bg-green-50' : 'border-orange-500 text-orange-700'}`}
                        >
                          {post.solved ? '✅ Gelöst' : '❓ Offen'}
                        </Badge>
                      )}
                    </div>

                    {/* Engagement Bar */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-6">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-1 hover:text-red-500">
                                <Heart className="h-4 w-4" />
                                {post.likes}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Gefällt mir
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <Button variant="ghost" size="sm" className="gap-1 hover:text-blue-500">
                          <MessageCircle className="h-4 w-4" />
                          {post.comments}
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="gap-1 hover:text-green-500">
                          <Share2 className="h-4 w-4" />
                          {post.shares}
                        </Button>
                        
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Bookmark className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Speichern
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Mehr lesen
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {sortedPosts.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold mb-2">Keine Beiträge gefunden</p>
                    <p className="text-muted-foreground">Versuche andere Suchbegriffe oder Filter</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { tag: '#ReactHooks', posts: 45, growth: '+12%' },
                      { tag: '#AIPrompting', posts: 38, growth: '+24%' },
                      { tag: '#TypeScript', posts: 29, growth: '+8%' },
                      { tag: '#CloudCode', posts: 22, growth: '+15%' },
                      { tag: '#FullStack', posts: 18, growth: '+6%' }
                    ].map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer">
                        <div>
                          <div className="font-medium text-sm">{topic.tag}</div>
                          <div className="text-xs text-muted-foreground">{topic.posts} Beiträge</div>
                        </div>
                        <Badge variant="outline" className="text-xs text-green-600">
                          {topic.growth}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Contributors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Crown className="h-5 w-5" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Sarah Chen', rank: 'Prophet', contributions: 156, avatar: '/avatars/sarah.jpg' },
                      { name: 'Marcus Rodriguez', rank: 'Architect', contributions: 134, avatar: '/avatars/marcus.jpg' },
                      { name: 'David Kim', rank: 'Prophet', contributions: 128, avatar: '/avatars/david.jpg' },
                      { name: 'Lisa Zhang', rank: 'Architect', contributions: 98, avatar: '/avatars/lisa.jpg' }
                    ].map((contributor, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded cursor-pointer">
                        <div className="text-sm font-bold text-muted-foreground w-6">
                          #{index + 1}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={contributor.avatar} alt={contributor.name} />
                          <AvatarFallback className="text-xs">
                            {contributor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{contributor.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {contributor.contributions} Beiträge • {contributor.rank}
                          </div>
                        </div>
                        {getRankIcon(contributor.rank)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Live Events Tab */}
        <TabsContent value="live" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    {event.live ? (
                      <Badge className="bg-red-100 text-red-800">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
                        LIVE
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        {new Date(event.startTime).toLocaleTimeString('de-DE', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {event.host.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>Host: {event.host}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{event.participants}/{event.maxParticipants}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="w-full" disabled={event.participants >= event.maxParticipants}>
                    {event.live ? 'Jetzt beitreten' : 'Anmelden'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Other tabs would be implemented similarly... */}
        <TabsContent value="leaderboard">
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold mb-2">Bestenliste</p>
              <p className="text-muted-foreground">Wird bald verfügbar sein!</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources">
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold mb-2">Community Ressourcen</p>
              <p className="text-muted-foreground">Wird bald verfügbar sein!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}