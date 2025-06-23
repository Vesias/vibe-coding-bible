'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AuthGuard, TierGuard } from '@/lib/auth/guards'
import { useAdvancedAuth } from '@/lib/auth/hooks'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { 
  Plus, 
  Users, 
  Play, 
  Clock, 
  Search,
  Filter,
  Video,
  Mic,
  Monitor,
  Bot,
  Star,
  Globe,
  Lock,
  Crown,
  Zap,
  Calendar,
  Code,
  ArrowRight,
  Flame,
  TrendingUp
} from 'lucide-react'

interface CollaborationSession {
  id: string
  name: string
  description?: string
  host_user_id: string
  status: 'active' | 'scheduled' | 'ended'
  current_participants: number
  max_participants: number
  voice_chat_enabled: boolean
  screen_sharing_enabled: boolean
  ai_mentor_enabled: boolean
  created_at: string
  language?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  tags?: string[]
  host?: {
    full_name: string
    avatar_url?: string
    prophet_rank: string
  }
}

export default function CollaborationPage() {
  const { 
    user, 
    tier, 
    collaborationAccess, 
    loading 
  } = useAdvancedAuth()
  
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [sessions, setSessions] = useState<CollaborationSession[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'scheduled' | 'my-sessions'>('all')
  const [joinCode, setJoinCode] = useState('')
  const [joiningSession, setJoiningSession] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadSessions()
    }
  }, [user, filter])

  const loadSessions = async () => {
    setLoadingSessions(true)
    
    try {
      let query = supabase
        .from('collaboration_sessions')
        .select(`
          *,
          users!collaboration_sessions_host_user_id_fkey (
            full_name,
            avatar_url,
            prophet_rank
          )
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filter === 'active') {
        query = query.eq('status', 'active')
      } else if (filter === 'scheduled') {
        query = query.eq('status', 'scheduled')
      } else if (filter === 'my-sessions') {
        query = query.eq('host_user_id', user?.id)
      }

      const { data, error } = await query.limit(20)
      
      if (error) throw error
      
      // Transform data to include host info
      const transformedSessions = data?.map(session => ({
        ...session,
        host: session.users,
        language: 'javascript', // Default for now
        difficulty: 'intermediate' as const,
        tags: ['React', 'JavaScript'] // Mock tags
      })) || []
      
      setSessions(transformedSessions)
      
    } catch (error) {
      console.error('Error loading sessions:', error)
      toast({
        title: "Error",
        description: "Failed to load collaboration sessions",
        variant: "destructive"
      })
    } finally {
      setLoadingSessions(false)
    }
  }

  const handleCreateSession = () => {
    if (!collaborationAccess.canCreateSession()) {
      router.push('/pricing')
      return
    }
    router.push('/collaboration/create')
  }

  const handleJoinSession = async (sessionId: string) => {
    if (!collaborationAccess.canJoinSession()) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to join sessions",
        variant: "destructive"
      })
      return
    }

    setJoiningSession(sessionId)
    
    try {
      // Check if session exists and has space
      const { data: session, error } = await supabase
        .from('collaboration_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()
      
      if (error) throw error
      
      if (session.current_participants >= session.max_participants) {
        toast({
          title: "Session Full",
          description: "This session has reached maximum capacity",
          variant: "destructive"
        })
        return
      }
      
      // Join the session
      router.push(`/collaboration/session/${sessionId}`)
      
    } catch (error) {
      console.error('Error joining session:', error)
      toast({
        title: "Error",
        description: "Failed to join session",
        variant: "destructive"
      })
    } finally {
      setJoiningSession(null)
    }
  }

  const handleJoinByCode = async () => {
    if (!joinCode.trim()) return
    
    try {
      // Look for session by join code (session ID)
      const { data: session, error } = await supabase
        .from('collaboration_sessions')
        .select('*')
        .eq('id', joinCode.trim())
        .single()
      
      if (error || !session) {
        toast({
          title: "Invalid Code",
          description: "Session not found with this code",
          variant: "destructive"
        })
        return
      }
      
      handleJoinSession(session.id)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find session",
        variant: "destructive"
      })
    }
  }

  const filteredSessions = sessions.filter(session => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        session.name.toLowerCase().includes(query) ||
        session.description?.toLowerCase().includes(query) ||
        session.host?.full_name.toLowerCase().includes(query)
      )
    }
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'ended': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
              <Users className="h-10 w-10 text-primary" />
              Divine Collaboration
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join fellow seekers in real-time coding sessions, share knowledge, and ascend together through the sacred art of programming
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Create Session */}
            <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={handleCreateSession}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Create Session</h3>
                  <p className="text-sm text-muted-foreground">
                    Start a new collaborative coding session
                  </p>
                </div>
                {!collaborationAccess.canCreateSession() && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                    <Crown className="h-3 w-3 mr-1" />
                    Upgrade Required
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Join by Code */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Code className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mt-4">Join by Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter a session code to join
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Session code..."
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleJoinByCode()}
                  />
                  <Button onClick={handleJoinByCode} disabled={!joinCode.trim()}>
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Browse Sessions */}
            <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={() => setFilter('active')}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Browse Sessions</h3>
                  <p className="text-sm text-muted-foreground">
                    Find active sessions to join
                  </p>
                </div>
                <Badge variant="outline">
                  {sessions.filter(s => s.status === 'active').length} Active
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search sessions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: 'All Sessions', count: sessions.length },
                    { id: 'active', label: 'Active', count: sessions.filter(s => s.status === 'active').length },
                    { id: 'scheduled', label: 'Scheduled', count: sessions.filter(s => s.status === 'scheduled').length },
                    { id: 'my-sessions', label: 'My Sessions', count: sessions.filter(s => s.host_user_id === user?.id).length }
                  ].map(filterOption => (
                    <Button
                      key={filterOption.id}
                      variant={filter === filterOption.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter(filterOption.id as any)}
                    >
                      {filterOption.label}
                      {filterOption.count > 0 && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {filterOption.count}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {loadingSessions ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading sessions...</p>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No sessions found</h3>
                  <p className="text-sm">
                    {filter === 'my-sessions' 
                      ? "You haven't created any sessions yet"
                      : "No active sessions match your criteria"
                    }
                  </p>
                  {filter !== 'my-sessions' && (
                    <Button 
                      className="mt-4" 
                      onClick={handleCreateSession}
                      disabled={!collaborationAccess.canCreateSession()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Session
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredSessions.map(session => (
                    <Card key={session.id} className="group hover:shadow-lg transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {session.name}
                              </CardTitle>
                              <Badge className={getStatusColor(session.status)}>
                                {session.status === 'active' && <div className="w-2 h-2 bg-current rounded-full mr-1 animate-pulse" />}
                                {session.status.toUpperCase()}
                              </Badge>
                            </div>
                            
                            {session.description && (
                              <CardDescription className="text-sm">
                                {session.description}
                              </CardDescription>
                            )}
                          </div>
                        </div>

                        {/* Host Info */}
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={session.host?.avatar_url} alt={session.host?.full_name} />
                            <AvatarFallback className="text-xs">
                              {session.host?.full_name?.charAt(0) || 'H'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            Hosted by {session.host?.full_name || 'Unknown'}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {session.host?.prophet_rank || 'novice'}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Session Features */}
                        <div className="flex flex-wrap gap-2">
                          {session.voice_chat_enabled && (
                            <Badge variant="outline" className="text-xs">
                              <Mic className="h-3 w-3 mr-1" />
                              Voice
                            </Badge>
                          )}
                          {session.screen_sharing_enabled && (
                            <Badge variant="outline" className="text-xs">
                              <Monitor className="h-3 w-3 mr-1" />
                              Screen Share
                            </Badge>
                          )}
                          {session.ai_mentor_enabled && (
                            <Badge variant="outline" className="text-xs">
                              <Bot className="h-3 w-3 mr-1" />
                              AI Mentor
                            </Badge>
                          )}
                          {session.language && (
                            <Badge variant="outline" className="text-xs">
                              <Code className="h-3 w-3 mr-1" />
                              {session.language}
                            </Badge>
                          )}
                          {session.difficulty && (
                            <Badge variant="outline" className={`text-xs ${getDifficultyColor(session.difficulty)}`}>
                              {session.difficulty}
                            </Badge>
                          )}
                        </div>

                        {/* Session Stats */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{session.current_participants}/{session.max_participants}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatTimeAgo(session.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          onClick={() => handleJoinSession(session.id)}
                          disabled={
                            joiningSession === session.id ||
                            session.current_participants >= session.max_participants ||
                            !collaborationAccess.canJoinSession()
                          }
                          className="w-full group-hover:bg-primary/90 transition-colors"
                        >
                          {joiningSession === session.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : session.status === 'active' ? (
                            <Play className="h-4 w-4 mr-2" />
                          ) : (
                            <Calendar className="h-4 w-4 mr-2" />
                          )}
                          {session.current_participants >= session.max_participants
                            ? 'Session Full'
                            : session.status === 'active'
                            ? 'Join Session'
                            : 'View Schedule'
                          }
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tier Upgrade Prompt */}
          {!collaborationAccess.canCreateSession() && (
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Unlock Divine Collaboration</h3>
                      <p className="text-sm text-muted-foreground">
                        Upgrade to {tier === 'free' ? 'Apostle' : 'Prophet'} tier to create unlimited sessions and access advanced features
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => router.push('/pricing')}
                    className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}