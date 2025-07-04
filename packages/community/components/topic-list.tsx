'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Clock, 
  Pin, 
  Lock, 
  Star,
  CheckCircle,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  SortAsc,
  Tag
} from 'lucide-react'
import { Button } from '@repo/design-system/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/design-system/components/ui/card'
import { Badge } from '@repo/design-system/components/ui/badge'
import { Input } from '@repo/design-system/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/design-system/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@repo/design-system/components/ui/dropdown-menu'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@repo/design-system/components/ui/select'
import { formatDistanceToNow } from 'date-fns'
import { Topic, TopicListParams, VoteStats } from '../lib/types'
import { communityService } from '../lib/community-service'

interface TopicListProps {
  forumId?: string
  showCreateButton?: boolean
  onTopicClick?: (topic: Topic) => void
  onCreateTopic?: () => void
  className?: string
}

export function TopicList({ 
  forumId, 
  showCreateButton = false, 
  onTopicClick, 
  onCreateTopic,
  className 
}: TopicListProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterBy, setFilterBy] = useState<string>('all')
  const [voteStats, setVoteStats] = useState<Record<string, VoteStats>>({})

  useEffect(() => {
    loadTopics()
  }, [forumId, sortBy, sortOrder, filterBy])

  const loadTopics = async () => {
    try {
      setLoading(true)
      const params: TopicListParams = {
        forumId,
        sortBy,
        sortOrder,
        page: 1,
        limit: 50
      }

      if (filterBy === 'featured') params.isFeatured = true
      if (filterBy === 'solved') params.isSolved = true

      const response = await communityService.getTopics(params)
      
      if (response.success) {
        setTopics(response.data)
        // Load vote stats for each topic
        loadVoteStats(response.data)
      } else {
        setError(response.message || 'Failed to load topics')
      }
    } catch (err) {
      setError('Failed to load topics')
      console.error('Error loading topics:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadVoteStats = async (topicList: Topic[]) => {
    const stats: Record<string, VoteStats> = {}
    
    for (const topic of topicList) {
      try {
        const response = await communityService.getVoteStats('topic', topic.id)
        if (response.success) {
          stats[topic.id] = response.data
        }
      } catch (err) {
        console.error('Error loading vote stats:', err)
      }
    }
    
    setVoteStats(stats)
  }

  const handleVote = async (topicId: string, voteType: 'up' | 'down') => {
    try {
      await communityService.vote('topic', topicId, voteType)
      // Reload vote stats for this topic
      const response = await communityService.getVoteStats('topic', topicId)
      if (response.success) {
        setVoteStats(prev => ({
          ...prev,
          [topicId]: response.data
        }))
      }
    } catch (err) {
      console.error('Error voting:', err)
    }
  }

  const filteredTopics = topics.filter(topic => 
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.tags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const TopicIcon = ({ topic }: { topic: Topic }) => {
    if (topic.isPinned) return <Pin className="h-4 w-4 text-primary" />
    if (topic.isLocked) return <Lock className="h-4 w-4 text-muted-foreground" />
    if (topic.isFeatured) return <Star className="h-4 w-4 text-yellow-500" />
    if (topic.isSolved) return <CheckCircle className="h-4 w-4 text-green-500" />
    return <MessageSquare className="h-4 w-4" />
  }

  const VoteButtons = ({ topic }: { topic: Topic }) => {
    const stats = voteStats[topic.id] || { upvotes: 0, downvotes: 0, score: 0 }
    
    return (
      <div className="flex flex-col items-center gap-1 min-w-0">
        <Button
          variant={stats.userVote === 'up' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleVote(topic.id, 'up')}
          className="p-1 h-auto"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        
        <span className={`text-sm font-medium ${
          stats.score > 0 ? 'text-green-600' : 
          stats.score < 0 ? 'text-red-600' : 
          'text-muted-foreground'
        }`}>
          {stats.score}
        </span>
        
        <Button
          variant={stats.userVote === 'down' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleVote(topic.id, 'down')}
          className="p-1 h-auto"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const TopicCard = ({ topic }: { topic: Topic }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Vote Section */}
            <VoteButtons topic={topic} />
            
            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <TopicIcon topic={topic} />
                  <h3 
                    className="font-semibold text-lg hover:text-primary cursor-pointer truncate"
                    onClick={() => onTopicClick?.(topic)}
                  >
                    {topic.title}
                  </h3>
                  
                  {/* Status Badges */}
                  <div className="flex items-center gap-1">
                    {topic.isPinned && (
                      <Badge variant="secondary" className="text-xs">
                        Pinned
                      </Badge>
                    )}
                    {topic.isLocked && (
                      <Badge variant="outline" className="text-xs">
                        Locked
                      </Badge>
                    )}
                    {topic.isFeatured && (
                      <Badge variant="default" className="text-xs bg-yellow-500">
                        Featured
                      </Badge>
                    )}
                    {topic.isSolved && (
                      <Badge variant="default" className="text-xs bg-green-500">
                        Solved
                      </Badge>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onTopicClick?.(topic)}>
                      View Topic
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Subscribe
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Content Preview */}
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {topic.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
              </p>

              {/* Tags */}
              {topic.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-3 w-3 text-muted-foreground" />
                  <div className="flex flex-wrap gap-1">
                    {topic.tags.slice(0, 5).map(tag => (
                      <Badge 
                        key={tag.id} 
                        variant="outline" 
                        className="text-xs"
                        style={{ backgroundColor: tag.color ? `${tag.color}20` : undefined }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                    {topic.tags.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{topic.tags.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={topic.author.avatar} />
                      <AvatarFallback className="text-xs">
                        {topic.author.displayName?.[0] || topic.author.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>{topic.author.displayName || topic.author.username}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(topic.createdAt, { addSuffix: true })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{topic.views}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{topic.commentsCount}</span>
                  </div>

                  {topic.lastCommentAt && (
                    <div className="flex items-center gap-1">
                      <span>Last reply {formatDistanceToNow(topic.lastCommentAt, { addSuffix: true })}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-12 h-20 bg-muted rounded" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-muted rounded w-16" />
                    <div className="h-5 bg-muted rounded w-16" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadTopics} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Topics</h2>
          <Badge variant="secondary">{topics.length} topics</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {showCreateButton && (
            <Button onClick={onCreateTopic}>
              <Plus className="h-4 w-4 mr-2" />
              New Topic
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="solved">Solved</SelectItem>
                <SelectItem value="unsolved">Unsolved</SelectItem>
                <SelectItem value="pinned">Pinned</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Latest</SelectItem>
                <SelectItem value="lastCommentAt">Last Reply</SelectItem>
                <SelectItem value="voteScore">Most Voted</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="commentsCount">Most Replies</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <SortAsc className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Topic List */}
      <div className="space-y-3">
        {filteredTopics.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No topics found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Be the first to start a discussion!'}
              </p>
              {showCreateButton && (
                <Button onClick={onCreateTopic}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Topic
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            {filteredTopics.map(topic => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
} 