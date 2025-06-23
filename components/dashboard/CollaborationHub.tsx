'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  Calendar,
  MapPin,
  Zap,
  Heart
} from 'lucide-react'

interface CollaborationSession {
  id: string
  name: string
  participants: number
  status: 'active' | 'scheduled' | 'paused'
  startTime: string
  topic?: string
  isHost?: boolean
  maxParticipants?: number
  language?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

interface CollaborationHubProps {
  activeSessions: CollaborationSession[]
  collaborationAccess: any
  tier: string
}

export function CollaborationHub({ 
  activeSessions, 
  collaborationAccess, 
  tier 
}: CollaborationHubProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'active' | 'scheduled' | 'create'>('active')

  // Mock sessions data
  const allSessions: CollaborationSession[] = [
    ...activeSessions,
    {
      id: '2',
      name: 'React Hooks Deep Dive',
      participants: 8,
      status: 'active',
      startTime: '2024-01-20T14:00:00Z',
      topic: 'Advanced React Patterns',
      maxParticipants: 12,
      language: 'JavaScript',
      difficulty: 'intermediate'
    },
    {
      id: '3',
      name: 'TypeScript Workshop',
      participants: 5,
      status: 'active',
      startTime: '2024-01-20T15:30:00Z',
      topic: 'Type Safety Fundamentals',
      maxParticipants: 8,
      language: 'TypeScript',
      difficulty: 'beginner'
    },
    {
      id: '4',
      name: 'Code Review Session',
      participants: 3,
      status: 'scheduled',
      startTime: '2024-01-20T18:00:00Z',
      topic: 'Project Portfolio Review',
      maxParticipants: 6,
      difficulty: 'intermediate',
      isHost: true
    }
  ]

  const mockFriends = [
    { id: '1', name: 'Alex Chen', avatar: '', status: 'online', currentSession: 'React Hooks Deep Dive' },
    { id: '2', name: 'Sarah Kim', avatar: '', status: 'in-session', currentSession: 'TypeScript Workshop' },
    { id: '3', name: 'Mike Johnson', avatar: '', status: 'offline', currentSession: null },
    { id: '4', name: 'Emma Davis', avatar: '', status: 'online', currentSession: null }
  ]

  const handleJoinSession = async (sessionId: string) => {
    if (!collaborationAccess.canJoinSession()) return
    
    setLoading(sessionId)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push(`/collaboration/session/${sessionId}`)
    setLoading(null)
  }

  const handleCreateSession = async () => {
    if (!collaborationAccess.canCreateSession()) {
      router.push('/pricing')
      return
    }
    
    setLoading('create')
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push('/collaboration/create')
    setLoading(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
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

  const formatSessionTime = (startTime: string) => {
    const date = new Date(startTime)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    
    if (diff < 0) {
      // Session is active
      const elapsed = Math.abs(diff)
      const hours = Math.floor(elapsed / (1000 * 60 * 60))
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
      return `${hours}h ${minutes}m ago`
    } else {
      // Session is scheduled
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      if (hours < 1) return `in ${minutes}m`
      return `in ${hours}h ${minutes}m`
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Collaboration Hub</CardTitle>
              <CardDescription>
                Connect and code with fellow seekers
              </CardDescription>
            </div>
          </div>
          
          <Button
            size="sm"
            onClick={handleCreateSession}
            disabled={loading === 'create' || !collaborationAccess.canCreateSession()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            {loading === 'create' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Create
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {[
            { id: 'active', label: 'Live', icon: Video, count: allSessions.filter(s => s.status === 'active').length },
            { id: 'scheduled', label: 'Scheduled', icon: Calendar, count: allSessions.filter(s => s.status === 'scheduled').length },
            { id: 'create', label: 'Friends', icon: Heart, count: mockFriends.filter(f => f.status === 'online').length }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-1"
              >
                <Icon className="h-4 w-4 mr-1" />
                {tab.label}
                {tab.count > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tab.count}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Active Sessions */}
        {activeTab === 'active' && (
          <div className="space-y-3">
            {allSessions.filter(session => session.status === 'active').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No active sessions</p>
                <p className="text-sm">Create or join a session to start collaborating!</p>
              </div>
            ) : (
              allSessions
                .filter(session => session.status === 'active')
                .map(session => (
                  <div
                    key={session.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-all group cursor-pointer"
                    onClick={() => handleJoinSession(session.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium group-hover:text-primary transition-colors">
                          {session.name}
                        </span>
                        {session.isHost && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      
                      <Badge className={getStatusColor(session.status)}>
                        <Video className="h-3 w-3 mr-1" />
                        LIVE
                      </Badge>
                    </div>
                    
                    {session.topic && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {session.topic}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{session.participants}/{session.maxParticipants || '∞'}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{formatSessionTime(session.startTime)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {session.language && (
                          <Badge variant="outline" className="text-xs">
                            {session.language}
                          </Badge>
                        )}
                        {session.difficulty && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getDifficultyColor(session.difficulty)}`}
                          >
                            {session.difficulty}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      disabled={loading === session.id}
                    >
                      {loading === session.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      Join Session
                    </Button>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Scheduled Sessions */}
        {activeTab === 'scheduled' && (
          <div className="space-y-3">
            {allSessions.filter(session => session.status === 'scheduled').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No scheduled sessions</p>
                <p className="text-sm">Schedule a session for later!</p>
              </div>
            ) : (
              allSessions
                .filter(session => session.status === 'scheduled')
                .map(session => (
                  <div
                    key={session.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{session.name}</span>
                        {session.isHost && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      
                      <Badge className={getStatusColor(session.status)}>
                        {formatSessionTime(session.startTime)}
                      </Badge>
                    </div>
                    
                    {session.topic && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {session.topic}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{session.participants} registered</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {session.isHost ? (
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-1" />
                            Manage
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <UserPlus className="h-4 w-4 mr-1" />
                            Register
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Friends / Social */}
        {activeTab === 'create' && (
          <div className="space-y-4">
            {/* Online Friends */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-500" />
                Coding Buddies
              </h4>
              
              {mockFriends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback className="text-xs">
                          {friend.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                        friend.status === 'online' ? 'bg-green-500' : 
                        friend.status === 'in-session' ? 'bg-blue-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    
                    <div>
                      <div className="font-medium text-sm">{friend.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {friend.status === 'in-session' && friend.currentSession 
                          ? `In: ${friend.currentSession}` 
                          : friend.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    {friend.status === 'online' && (
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                    )}
                    {friend.status === 'in-session' && (
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-3 w-3 mr-1" />
                        Join
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="flex flex-col h-20 justify-center"
                onClick={() => router.push('/friends')}
              >
                <UserPlus className="h-5 w-5 mb-1" />
                <span className="text-xs">Find Friends</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-20 justify-center"
                onClick={() => router.push('/mentoring')}
              >
                <Crown className="h-5 w-5 mb-1" />
                <span className="text-xs">Find Mentors</span>
              </Button>
            </div>
          </div>
        )}

        {/* Access Limitations */}
        {!collaborationAccess.canCreateSession() && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
              <Crown className="h-4 w-4" />
              <span className="font-medium">
                {tier === 'free' ? 'Upgrade to Create Sessions' : 'Session Limit Reached'}
              </span>
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              {tier === 'free' 
                ? 'Join sessions for free, or upgrade to host your own' 
                : 'You\'ve reached your monthly session limit'
              }
            </p>
            {tier === 'free' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                onClick={() => router.push('/pricing')}
              >
                Upgrade to Apostle
              </Button>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-indigo-600">
                {allSessions.filter(s => s.status === 'active').length}
              </div>
              <div className="text-xs text-muted-foreground">Active Sessions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {mockFriends.filter(f => f.status === 'online').length}
              </div>
              <div className="text-xs text-muted-foreground">Friends Online</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}