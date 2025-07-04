'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronRight, 
  MessageSquare, 
  Users, 
  Clock, 
  Lock, 
  Shield,
  Star,
  MoreHorizontal,
  Plus,
  Search,
  Filter
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
  DropdownMenuTrigger 
} from '@repo/design-system/components/ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'
import { Forum, ForumStats } from '../lib/types'
import { communityService } from '../lib/community-service'

interface ForumListProps {
  parentId?: string
  showCreateButton?: boolean
  onForumClick?: (forum: Forum) => void
  onCreateForum?: () => void
  className?: string
}

export function ForumList({ 
  parentId, 
  showCreateButton = false, 
  onForumClick, 
  onCreateForum,
  className 
}: ForumListProps) {
  const [forums, setForums] = useState<Forum[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedForums, setExpandedForums] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadForums()
  }, [parentId])

  const loadForums = async () => {
    try {
      setLoading(true)
      const response = await communityService.getForums({
        parentId,
        includeStats: true,
        includeChildren: true
      })
      
      if (response.success) {
        setForums(response.data)
      } else {
        setError(response.message || 'Failed to load forums')
      }
    } catch (err) {
      setError('Failed to load forums')
      console.error('Error loading forums:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (forumId: string) => {
    const newExpanded = new Set(expandedForums)
    if (newExpanded.has(forumId)) {
      newExpanded.delete(forumId)
    } else {
      newExpanded.add(forumId)
    }
    setExpandedForums(newExpanded)
  }

  const filteredForums = forums.filter(forum => 
    forum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    forum.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const ForumIcon = ({ forum }: { forum: Forum }) => {
    if (forum.isPrivate) return <Lock className="h-4 w-4" />
    if (forum.requiresApproval) return <Shield className="h-4 w-4" />
    return <MessageSquare className="h-4 w-4" />
  }

  const ForumStats = ({ stats }: { stats: ForumStats }) => (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <MessageSquare className="h-3 w-3" />
        <span>{stats.topicsCount}</span>
      </div>
      <div className="flex items-center gap-1">
        <Users className="h-3 w-3" />
        <span>{stats.activeUsers}</span>
      </div>
      {stats.lastPostAt && (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatDistanceToNow(stats.lastPostAt, { addSuffix: true })}</span>
        </div>
      )}
    </div>
  )

  const LastPost = ({ stats }: { stats: ForumStats }) => {
    if (!stats.lastPostAt || !stats.lastPostBy) return null

    return (
      <div className="flex items-center gap-2 text-sm">
        <Avatar className="h-6 w-6">
          <AvatarImage src={stats.lastPostBy.avatar} />
          <AvatarFallback>
            {stats.lastPostBy.displayName?.[0] || stats.lastPostBy.username[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Last post by</span>
          <span className="font-medium">{stats.lastPostBy.displayName || stats.lastPostBy.username}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(stats.lastPostAt, { addSuffix: true })}
        </div>
      </div>
    )
  }

  const ForumCard = ({ forum, level = 0 }: { forum: Forum; level?: number }) => {
    const hasChildren = forum.children && forum.children.length > 0
    const isExpanded = expandedForums.has(forum.id)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`ml-${level * 4}`}
      >
        <Card className="mb-2 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(forum.id)}
                    className="p-1 h-auto"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
                
                <div 
                  className={`flex items-center gap-2 p-2 rounded-lg ${forum.color ? `bg-${forum.color}-100` : 'bg-muted'}`}
                >
                  <ForumIcon forum={forum} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 
                      className="font-semibold text-lg hover:text-primary cursor-pointer truncate"
                      onClick={() => onForumClick?.(forum)}
                    >
                      {forum.name}
                    </h3>
                    {forum.isPrivate && (
                      <Badge variant="secondary" className="text-xs">
                        Private
                      </Badge>
                    )}
                    {forum.requiresApproval && (
                      <Badge variant="outline" className="text-xs">
                        Moderated
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {forum.description}
                  </p>
                  
                  <ForumStats stats={forum.stats} />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="hidden md:block min-w-0">
                  <LastPost stats={forum.stats} />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onForumClick?.(forum)}>
                      View Forum
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Subscribe
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Mark as Read
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-4"
            >
              {forum.children?.map(childForum => (
                <ForumCard 
                  key={childForum.id} 
                  forum={childForum} 
                  level={level + 1} 
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/4" />
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
          <Button onClick={loadForums} variant="outline">
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
          <h2 className="text-2xl font-bold">Forums</h2>
          <Badge variant="secondary">{forums.length} forums</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search forums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          {showCreateButton && (
            <Button onClick={onCreateForum} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Forum
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Filter Forums</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">All Forums</Button>
                  <Button variant="outline" size="sm">Public</Button>
                  <Button variant="outline" size="sm">Private</Button>
                  <Button variant="outline" size="sm">Moderated</Button>
                  <Button variant="outline" size="sm">Most Active</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forum List */}
      <div className="space-y-2">
        {filteredForums.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No forums found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'There are no forums in this category yet'}
              </p>
              {showCreateButton && (
                <Button onClick={onCreateForum}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Forum
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            {filteredForums.map(forum => (
              <ForumCard key={forum.id} forum={forum} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
} 