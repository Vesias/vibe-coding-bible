'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  TrendingUp, 
  Award, 
  Users, 
  Zap, 
  Crown, 
  Calendar,
  Target,
  BookOpen,
  Code,
  MessageCircle,
  Share2,
  Heart,
  Bell,
  Settings,
  PlusCircle,
  Activity,
  Clock,
  Star,
  Trophy,
  Flame,
  Gift,
  ChevronRight,
  ExternalLink,
  Play,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface EnhancedDashboardProps {
  user: any
  profile: any
  tier: string
  dashboardData: any
}

interface ActivityItem {
  id: string
  type: 'workshop_completed' | 'achievement_earned' | 'streak_milestone' | 'collaboration_joined' | 'content_shared'
  title: string
  description: string
  timestamp: string
  points?: number
  category?: string
  icon?: React.ReactNode
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: () => void
  category: 'learning' | 'social' | 'creation' | 'personal'
  premium?: boolean
}

interface PersonalizedRecommendation {
  id: string
  type: 'workshop' | 'collaboration' | 'challenge' | 'content'
  title: string
  description: string
  reason: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime?: number
  xpReward?: number
  priority: 'high' | 'medium' | 'low'
}

export function EnhancedDashboard({
  user,
  profile,
  tier,
  dashboardData
}: EnhancedDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([])
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([])
  const [loading, setLoading] = useState(false)

  // Enhanced mock data
  const mockActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'workshop_completed',
      title: 'Completed "The Holy Vision" Workshop',
      description: 'Successfully finished Commandment I with 95% score',
      timestamp: '2 hours ago',
      points: 250,
      category: 'learning',
      icon: <BookOpen className="h-4 w-4 text-blue-500" />
    },
    {
      id: '2',
      type: 'achievement_earned',
      title: 'Earned "Week Warrior" Achievement',
      description: 'Maintained 7-day learning streak',
      timestamp: '1 day ago',
      points: 300,
      category: 'achievement',
      icon: <Trophy className="h-4 w-4 text-yellow-500" />
    },
    {
      id: '3',
      type: 'collaboration_joined',
      title: 'Joined React Deep Dive Session',
      description: 'Collaborated with 8 other developers',
      timestamp: '2 days ago',
      category: 'social',
      icon: <Users className="h-4 w-4 text-purple-500" />
    },
    {
      id: '4',
      type: 'content_shared',
      title: 'Shared Code Snippet',
      description: '"Divine React Hook for AI Integration" received 23 likes',
      timestamp: '3 days ago',
      points: 150,
      category: 'creation',
      icon: <Share2 className="h-4 w-4 text-green-500" />
    }
  ]

  const mockRecommendations: PersonalizedRecommendation[] = [
    {
      id: '1',
      type: 'workshop',
      title: 'The Art of Divine Prompting',
      description: 'Master advanced AI prompting techniques for code generation',
      reason: 'Based on your interest in AI development and recent workshop completion',
      difficulty: 'intermediate',
      estimatedTime: 120,
      xpReward: 500,
      priority: 'high'
    },
    {
      id: '2',
      type: 'collaboration',
      title: 'TypeScript Mastery Session',
      description: 'Join a live coding session focused on advanced TypeScript patterns',
      reason: 'Perfect match for your current learning path',
      difficulty: 'advanced',
      estimatedTime: 90,
      priority: 'high'
    },
    {
      id: '3',
      type: 'challenge',
      title: 'Build a Full-Stack AI App',
      description: 'Apply your knowledge to create a complete application',
      reason: 'Ready for a practical challenge based on your progress',
      difficulty: 'advanced',
      estimatedTime: 300,
      xpReward: 1500,
      priority: 'medium'
    }
  ]

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Continue Learning',
      description: 'Resume your current workshop',
      icon: <Play className="h-5 w-5" />,
      action: () => window.location.href = '/workshops',
      category: 'learning'
    },
    {
      id: '2',
      title: 'Join Live Session',
      description: 'Connect with other developers',
      icon: <Users className="h-5 w-5" />,
      action: () => window.location.href = '/collaboration',
      category: 'social'
    },
    {
      id: '3',
      title: 'Share Knowledge',
      description: 'Create a tutorial or snippet',
      icon: <PlusCircle className="h-5 w-5" />,
      action: () => window.location.href = '/community/create',
      category: 'creation'
    },
    {
      id: '4',
      title: 'AI Code Review',
      description: 'Get AI feedback on your code',
      icon: <Code className="h-5 w-5" />,
      action: () => window.location.href = '/ai-mentor',
      category: 'learning',
      premium: tier === 'free'
    }
  ]

  useEffect(() => {
    setRecentActivities(mockActivities)
    setRecommendations(mockRecommendations)
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const filteredActivities = recentActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || activity.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Guten Morgen'
    if (hour < 18) return 'Guten Tag'
    return 'Guten Abend'
  }

  const getRankProgress = () => {
    const currentXP = profile?.total_xp || 0
    const currentLevel = profile?.current_level || 1
    const nextLevelXP = currentLevel * 1000
    const currentLevelXP = (currentLevel - 1) * 1000
    const progress = ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    return Math.min(100, Math.max(0, progress))
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with personalized greeting */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl" />
        <Card className="relative border-2 border-gradient-to-r from-blue-200 to-purple-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-4 ring-blue-200">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'D'}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {getGreeting()}, {profile?.full_name || 'Divine Coder'}! 👑
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Bereit für deine nächste Coding-Mission?
                  </p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Crown className="h-3 w-3 mr-1" />
                      Level {profile?.current_level || 1}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      <Zap className="h-3 w-3 mr-1" />
                      {profile?.total_xp?.toLocaleString() || '0'} XP
                    </Badge>
                    <Badge variant="secondary" className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800">
                      <Flame className="h-3 w-3 mr-1" />
                      {dashboardData?.learningStreak || 0} Tage Streak
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Aktualisieren
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Nachrichten
                  <Badge className="ml-2 bg-red-500 text-white text-xs">3</Badge>
                </Button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fortschritt zu Level {(profile?.current_level || 1) + 1}</span>
                <span>{Math.round(getRankProgress())}%</span>
              </div>
              <Progress value={getRankProgress()} className="h-3" />
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Card 
            key={action.id} 
            className="hover:shadow-lg transition-all cursor-pointer group"
            onClick={action.action}
          >
            <CardContent className="p-4 text-center">
              <div className="mb-3 flex justify-center">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full group-hover:scale-110 transition-transform">
                  {action.icon}
                </div>
              </div>
              <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
              <p className="text-xs text-muted-foreground">{action.description}</p>
              {action.premium && (
                <Badge className="mt-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Übersicht
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Aktivität
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Empfehlungen
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Community
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Weekly Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Wöchentlicher Fortschritt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {dashboardData?.weeklyProgress?.workshopsCompleted || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Workshops</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {dashboardData?.weeklyProgress?.xpEarned || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">XP Verdient</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Wochenziel (1000 XP)</span>
                    <span>{Math.min(100, ((dashboardData?.weeklyProgress?.xpEarned || 0) / 1000) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={Math.min(100, ((dashboardData?.weeklyProgress?.xpEarned || 0) / 1000) * 100)} />
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Neueste Erfolge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(dashboardData?.achievements || []).slice(0, 3).map((achievement: any) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground">{achievement.unlockedAt}</div>
                      </div>
                    </div>
                  ))}
                  
                  {(!dashboardData?.achievements || dashboardData.achievements.length === 0) && (
                    <div className="text-center py-4 text-muted-foreground">
                      <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Vervollständige Workshops um Erfolge freizuschalten!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current Workshops */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Aktuelle Workshops
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(dashboardData?.recentWorkshops || []).map((workshop: any) => (
                    <div key={workshop.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-sm">{workshop.title}</div>
                        <Badge variant="outline" className="text-xs">
                          {workshop.progress}%
                        </Badge>
                      </div>
                      <Progress value={workshop.progress} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">
                        Zuletzt: {workshop.lastAccessed}
                      </div>
                    </div>
                  ))}
                  
                  {(!dashboardData?.recentWorkshops || dashboardData.recentWorkshops.length === 0) && (
                    <div className="text-center py-4">
                      <Button className="w-full" onClick={() => window.location.href = '/workshops'}>
                        <Play className="h-4 w-4 mr-2" />
                        Erstes Workshop starten
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Letzte Aktivitäten
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Aktivitäten suchen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48"
                  />
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle</SelectItem>
                      <SelectItem value="learning">Lernen</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="achievement">Erfolge</SelectItem>
                      <SelectItem value="creation">Erstellt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{activity.title}</div>
                      <div className="text-sm text-muted-foreground">{activity.description}</div>
                      <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                    </div>
                    {activity.points && (
                      <Badge className="bg-green-100 text-green-800">
                        +{activity.points} XP
                      </Badge>
                    )}
                  </div>
                ))}
                
                {filteredActivities.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Keine Aktivitäten gefunden</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Personalisierte Empfehlungen
              </CardTitle>
              <CardDescription>
                Basierend auf deinem Fortschritt und Interessen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={rec.priority === 'high' ? 'default' : 'secondary'}
                            className={rec.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
                          >
                            {rec.priority === 'high' ? '🔥 Hoch' : 
                             rec.priority === 'medium' ? '⭐ Mittel' : '💡 Niedrig'}
                          </Badge>
                          {rec.difficulty && (
                            <Badge variant="outline">
                              {rec.difficulty === 'beginner' ? '🟢 Anfänger' :
                               rec.difficulty === 'intermediate' ? '🟡 Fortgeschritten' : '🔴 Experte'}
                            </Badge>
                          )}
                        </div>
                        
                        <Button size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <h3 className="font-semibold mb-1">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <p className="text-xs text-blue-600 mb-3">{rec.reason}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {rec.estimatedTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {rec.estimatedTime} min
                          </div>
                        )}
                        {rec.xpReward && (
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {rec.xpReward} XP
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Community Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Community Aktivität
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { user: 'Alex M.', action: 'teilte ein Code-Snippet', time: '5 min', likes: 12 },
                    { user: 'Sarah K.', action: 'vollendete Workshop "Prompt-Kunst"', time: '1h', likes: 8 },
                    { user: 'Mike J.', action: 'startete Live-Session', time: '2h', likes: 15 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {item.user.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{item.user}</div>
                          <div className="text-xs text-muted-foreground">{item.action}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">{item.time}</div>
                        <div className="flex items-center gap-1 text-xs">
                          <Heart className="h-3 w-3 text-red-500" />
                          {item.likes}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Community besuchen
                </Button>
              </CardContent>
            </Card>

            {/* Collaboration Hub */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Live Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'React Hooks Masterclass', participants: 12, live: true },
                    { name: 'TypeScript Workshop', participants: 8, live: true },
                    { name: 'AI Code Review', participants: 5, live: false, scheduled: '18:00' }
                  ].map((session, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-sm">{session.name}</div>
                        {session.live ? (
                          <Badge className="bg-red-100 text-red-800">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
                            LIVE
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            {session.scheduled}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {session.participants} Teilnehmer
                        </div>
                        <Button size="sm" variant={session.live ? 'default' : 'outline'}>
                          {session.live ? 'Beitreten' : 'Anmelden'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Session erstellen
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}