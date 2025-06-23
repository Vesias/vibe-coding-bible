'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  MessageCircle, 
  Code, 
  HelpCircle, 
  TrendingUp,
  Crown,
  Target,
  Zap,
  Brain
} from 'lucide-react'

interface AIDashboardProps {
  userTier: string
  userLevel: number
  userRank: string
}

export function AIDashboard({ userTier, userLevel, userRank }: AIDashboardProps) {
  const [activeTab, setActiveTab] = useState('chat')
  const [loadingStats, setLoadingStats] = useState(true)
  const [stats, setStats] = useState({
    chatUsage: { count: 0, limit: 100 },
    reviewUsage: { count: 0, limit: 50 },
    helpUsage: { count: 0, limit: 25 }
  })

  useEffect(() => {
    loadAIStats()
  }, [])

  const loadAIStats = async () => {
    try {
      setLoadingStats(true)
      // Mock data - replace with actual API call
      setStats({
        chatUsage: { count: 23, limit: 100 },
        reviewUsage: { count: 8, limit: 50 },
        helpUsage: { count: 5, limit: 25 }
      })
    } catch (error) {
      console.error('Failed to load AI stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          AI Assistant Dashboard
        </CardTitle>
        <CardDescription>
          Your personal AI mentors are ready to guide your coding journey
        </CardDescription>
        
        {/* Usage Overview */}
        {!loadingStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">AI Chat</span>
                <MessageCircle className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{stats.chatUsage.count}</div>
              <div className="text-xs text-muted-foreground">
                of {stats.chatUsage.limit} monthly
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Code Reviews</span>
                <Code className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold">{stats.reviewUsage.count}</div>
              <div className="text-xs text-muted-foreground">
                of {stats.reviewUsage.limit} monthly
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Help Sessions</span>
                <HelpCircle className="h-4 w-4 text-orange-500" />
              </div>
              <div className="text-2xl font-bold">{stats.helpUsage.count}</div>
              <div className="text-xs text-muted-foreground">
                of {stats.helpUsage.limit} monthly
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="review" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Review
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Help
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-6">
            <div className="space-y-4">
              <div className="text-center py-8">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-blue-500 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">AI Mentor Chat</h3>
                <p className="text-muted-foreground mb-4">
                  Chat with Moses the Code Giver, Solomon the Debugger, and other divine mentors
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="review" className="mt-6">
            <div className="space-y-4">
              <div className="text-center py-8">
                <Code className="h-16 w-16 mx-auto mb-4 text-green-500 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">AI Code Review</h3>
                <p className="text-muted-foreground mb-4">
                  Get instant feedback on your code from divine AI reviewers
                </p>
                <Button className="bg-gradient-to-r from-green-500 to-blue-600">
                  <Code className="h-4 w-4 mr-2" />
                  Submit Code
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="help" className="mt-6">
            <div className="space-y-4">
              <div className="text-center py-8">
                <HelpCircle className="h-16 w-16 mx-auto mb-4 text-orange-500 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">AI Help & Guidance</h3>
                <p className="text-muted-foreground mb-4">
                  Get personalized help with coding challenges and best practices
                </p>
                <Button className="bg-gradient-to-r from-orange-500 to-red-600">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Ask for Help
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              {loadingStats ? (
                <div className="text-center py-8">
                  <LoadingSpinner size="lg" />
                  <p className="text-muted-foreground mt-4">Loading AI analytics...</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        AI Interactions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {stats.chatUsage.count + stats.reviewUsage.count + stats.helpUsage.count}
                      </div>
                      <p className="text-sm text-gray-600">Total this month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-500" />
                        Success Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
                      <p className="text-sm text-gray-600">Problems solved</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Crown className="h-5 w-5 text-purple-500" />
                        Tier Benefits
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className="mb-2">{userTier}</Badge>
                      <p className="text-sm text-gray-600">Current subscription</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}