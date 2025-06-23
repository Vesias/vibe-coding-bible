'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  BookOpen, 
  Code, 
  Trophy, 
  Star,
  TrendingUp,
  Users,
  Zap,
  Crown,
  Plus,
  ExternalLink
} from 'lucide-react'

interface UserContent {
  id: string
  type: 'code_snippet' | 'tutorial' | 'success_story' | 'workshop_review' | 'ai_prompt' | 'project_showcase'
  title: string
  description: string
  content: string
  author: {
    name: string
    avatar: string
    rank: string
    xp: number
  }
  tags: string[]
  likes: number
  comments: number
  shares: number
  views: number
  createdAt: string
  featured?: boolean
  verified?: boolean
}

const mockContent: UserContent[] = [
  {
    id: '1',
    type: 'success_story',
    title: 'From Novice to Prophet: How I Built 3 SaaS Apps with AI',
    description: 'My journey mastering the 10 Commandments and building production apps without writing code manually.',
    content: 'Using Claude Code and the Sacred Commandments, I transformed my development process...',
    author: {
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      rank: 'Prophet',
      xp: 15420
    },
    tags: ['Success Story', 'SaaS', 'AI Development', 'Claude Code'],
    likes: 234,
    comments: 45,
    shares: 23,
    views: 1250,
    createdAt: '2024-01-15',
    featured: true,
    verified: true
  },
  {
    id: '2',
    type: 'code_snippet',
    title: 'Divine React Hook for AI Code Reviews',
    description: 'Custom hook that integrates AI code review into your development workflow.',
    content: 'const useAICodeReview = () => { /* Sacred code */ }',
    author: {
      name: 'Marcus Rodriguez',
      avatar: '/avatars/marcus.jpg', 
      rank: 'Architect',
      xp: 8750
    },
    tags: ['React', 'Hooks', 'AI Review', 'TypeScript'],
    likes: 89,
    comments: 12,
    shares: 8,
    views: 445,
    createdAt: '2024-01-14',
    verified: true
  },
  {
    id: '3',
    type: 'tutorial',
    title: 'The Sacred Art of AI Prompting for Code Generation',
    description: 'Master the Third Commandment with advanced prompting techniques.',
    content: 'The key to divine prompting is understanding the sacred patterns...',
    author: {
      name: 'Elena Vasquez',
      avatar: '/avatars/elena.jpg',
      rank: 'Practitioner', 
      xp: 6200
    },
    tags: ['AI Prompting', 'Code Generation', 'Best Practices'],
    likes: 156,
    comments: 28,
    shares: 19,
    views: 890,
    createdAt: '2024-01-13'
  }
]

export function UserContentHub() {
  const [content, setContent] = useState<UserContent[]>(mockContent)
  const [activeTab, setActiveTab] = useState('featured')
  const [loading, setLoading] = useState(false)

  const contentTypes = [
    { id: 'featured', label: 'Featured', icon: <Star className="h-4 w-4" /> },
    { id: 'success_story', label: 'Success Stories', icon: <Trophy className="h-4 w-4" /> },
    { id: 'code_snippet', label: 'Code Snippets', icon: <Code className="h-4 w-4" /> },
    { id: 'tutorial', label: 'Tutorials', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'project_showcase', label: 'Projects', icon: <Zap className="h-4 w-4" /> }
  ]

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Prophet': return <Crown className="h-4 w-4 text-yellow-500" />
      case 'Architect': return <TrendingUp className="h-4 w-4 text-purple-500" />
      case 'Practitioner': return <Zap className="h-4 w-4 text-blue-500" />
      default: return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  const getContentByType = (type: string) => {
    if (type === 'featured') {
      return content.filter(item => item.featured)
    }
    return content.filter(item => item.type === type)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🌟 Community Wisdom Hub
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
          Share your divine coding journey, learn from fellow prophets, and spread the sacred wisdom of AI-assisted development.
        </p>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="h-4 w-4" />
          Share Your Wisdom
        </Button>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {contentTypes.map((type) => (
            <TabsTrigger key={type.id} value={type.id} className="gap-2">
              {type.icon}
              <span className="hidden sm:inline">{type.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {contentTypes.map((type) => (
          <TabsContent key={type.id} value={type.id} className="space-y-6">
            <div className="grid gap-6">
              {getContentByType(type.id).map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={item.author.avatar} alt={item.author.name} />
                          <AvatarFallback>{item.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {item.author.name}
                            </h3>
                            {getRankIcon(item.author.rank)}
                            <Badge variant="secondary" className="text-xs">
                              {item.author.rank}
                            </Badge>
                            {item.verified && <Badge variant="default" className="text-xs bg-blue-500">Verified</Badge>}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.author.xp.toLocaleString()} XP • {item.createdAt}
                          </p>
                        </div>
                      </div>
                      {item.featured && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black">
                          ⭐ Featured
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <CardTitle className="text-xl mb-2 hover:text-blue-600 cursor-pointer">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {item.description}
                      </CardDescription>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {item.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {item.comments}
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          {item.shares}
                        </div>
                        <div className="flex items-center gap-1">
                          👁️ {item.views}
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Content Creation CTA */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Share Your Divine Coding Journey
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Help fellow developers by sharing your success stories, code snippets, tutorials, and project showcases. 
            Build your reputation in the community and earn XP for valuable contributions.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Trophy className="h-4 w-4" />
              Share Success Story
            </Button>
            <Button variant="outline" className="gap-2">
              <Code className="h-4 w-4" />
              Submit Code Snippet
            </Button>
            <Button variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Create Tutorial
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}