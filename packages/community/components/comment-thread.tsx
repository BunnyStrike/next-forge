'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowUp, 
  ArrowDown, 
  Reply, 
  MoreHorizontal,
  Flag,
  Edit,
  Trash2,
  CheckCircle,
  MessageSquare,
  Clock,
  Heart,
  Share,
  Bookmark
} from 'lucide-react'
import { Button } from '@repo/design-system/components/ui/button'
import { Card, CardContent } from '@repo/design-system/components/ui/card'
import { Badge } from '@repo/design-system/components/ui/badge'
import { Textarea } from '@repo/design-system/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/design-system/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@repo/design-system/components/ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'
import { Comment, CommentListParams, VoteStats } from '../lib/types'
import { communityService } from '../lib/community-service'

interface CommentThreadProps {
  topicId: string
  allowReplies?: boolean
  allowVoting?: boolean
  allowModeration?: boolean
  maxDepth?: number
  className?: string
}

export function CommentThread({ 
  topicId, 
  allowReplies = true,
  allowVoting = true,
  allowModeration = false,
  maxDepth = 5,
  className 
}: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [newReply, setNewReply] = useState('')
  const [editContent, setEditContent] = useState('')
  const [voteStats, setVoteStats] = useState<Record<string, VoteStats>>({})

  useEffect(() => {
    loadComments()
  }, [topicId])

  const loadComments = async () => {
    try {
      setLoading(true)
      const response = await communityService.getComments({
        topicId,
        includeChildren: true,
        sortBy: 'createdAt',
        sortOrder: 'asc'
      })
      
      if (response.success) {
        setComments(buildCommentTree(response.data))
        loadVoteStats(response.data)
      } else {
        setError(response.message || 'Failed to load comments')
      }
    } catch (err) {
      setError('Failed to load comments')
      console.error('Error loading comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const buildCommentTree = (flatComments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>()
    const rootComments: Comment[] = []

    // First pass: create map and initialize children arrays
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, children: [] })
    })

    // Second pass: build tree structure
    flatComments.forEach(comment => {
      const commentWithChildren = commentMap.get(comment.id)!
      
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId)
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(commentWithChildren)
        }
      } else {
        rootComments.push(commentWithChildren)
      }
    })

    return rootComments
  }

  const loadVoteStats = async (commentList: Comment[]) => {
    const stats: Record<string, VoteStats> = {}
    
    for (const comment of commentList) {
      try {
        const response = await communityService.getVoteStats('comment', comment.id)
        if (response.success) {
          stats[comment.id] = response.data
        }
      } catch (err) {
        console.error('Error loading vote stats:', err)
      }
    }
    
    setVoteStats(stats)
  }

  const handleVote = async (commentId: string, voteType: 'up' | 'down') => {
    try {
      await communityService.vote('comment', commentId, voteType)
      const response = await communityService.getVoteStats('comment', commentId)
      if (response.success) {
        setVoteStats(prev => ({
          ...prev,
          [commentId]: response.data
        }))
      }
    } catch (err) {
      console.error('Error voting:', err)
    }
  }

  const handleReply = async (parentId: string) => {
    if (!newReply.trim()) return

    try {
      const response = await communityService.createComment({
        content: newReply,
        topicId,
        parentId,
        contentType: 'text'
      })

      if (response.success) {
        setNewReply('')
        setReplyingTo(null)
        loadComments() // Reload to get updated tree
      }
    } catch (err) {
      console.error('Error creating reply:', err)
    }
  }

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      const response = await communityService.updateComment(commentId, {
        content: editContent
      })

      if (response.success) {
        setEditContent('')
        setEditingComment(null)
        loadComments()
      }
    } catch (err) {
      console.error('Error updating comment:', err)
    }
  }

  const handleDelete = async (commentId: string) => {
    try {
      await communityService.deleteComment(commentId)
      loadComments()
    } catch (err) {
      console.error('Error deleting comment:', err)
    }
  }

  const VoteButtons = ({ comment }: { comment: Comment }) => {
    if (!allowVoting) return null
    
    const stats = voteStats[comment.id] || { upvotes: 0, downvotes: 0, score: 0 }
    
    return (
      <div className="flex items-center gap-1">
        <Button
          variant={stats.userVote === 'up' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleVote(comment.id, 'up')}
          className="p-1 h-auto"
        >
          <ArrowUp className="h-3 w-3" />
        </Button>
        
        <span className={`text-xs font-medium px-1 ${
          stats.score > 0 ? 'text-green-600' : 
          stats.score < 0 ? 'text-red-600' : 
          'text-muted-foreground'
        }`}>
          {stats.score}
        </span>
        
        <Button
          variant={stats.userVote === 'down' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleVote(comment.id, 'down')}
          className="p-1 h-auto"
        >
          <ArrowDown className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  const CommentActions = ({ comment }: { comment: Comment }) => (
    <div className="flex items-center gap-1">
      {allowReplies && comment.level < maxDepth && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setReplyingTo(comment.id)}
          className="p-1 h-auto text-muted-foreground hover:text-foreground"
        >
          <Reply className="h-3 w-3 mr-1" />
          <span className="text-xs">Reply</span>
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        className="p-1 h-auto text-muted-foreground hover:text-foreground"
      >
        <Heart className="h-3 w-3 mr-1" />
        <span className="text-xs">Like</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Share className="h-3 w-3 mr-2" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bookmark className="h-3 w-3 mr-2" />
            Save
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditingComment(comment.id)}>
            <Edit className="h-3 w-3 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleDelete(comment.id)}
            className="text-destructive"
          >
            <Trash2 className="h-3 w-3 mr-2" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <Flag className="h-3 w-3 mr-2" />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  const CommentComponent = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${depth > 0 ? 'ml-8 mt-2' : 'mt-4'}`}
    >
      <Card className="relative">
        {depth > 0 && (
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-muted" />
        )}
        
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback className="text-xs">
                {comment.author.displayName?.[0] || comment.author.username[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">
                  {comment.author.displayName || comment.author.username}
                </span>
                
                {comment.author.isVerified && (
                  <CheckCircle className="h-3 w-3 text-primary" />
                )}
                
                {comment.isAcceptedAnswer && (
                  <Badge variant="default" className="text-xs bg-green-500">
                    Accepted Answer
                  </Badge>
                )}
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
                </div>

                {comment.editedAt && (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                )}
              </div>

              {/* Content */}
              {editingComment === comment.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Edit your comment..."
                    className="min-h-20"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleEdit(comment.id)}
                      disabled={!editContent.trim()}
                    >
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setEditingComment(null)
                        setEditContent('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none mb-3">
                  <p className="text-sm leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <VoteButtons comment={comment} />
                  <CommentActions comment={comment} />
                </div>
                
                {comment.mentions?.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                      Mentioned {comment.mentions.length} user{comment.mentions.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-2"
                >
                  <Textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Write a reply..."
                    className="min-h-20"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleReply(comment.id)}
                      disabled={!newReply.trim()}
                    >
                      Reply
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setReplyingTo(null)
                        setNewReply('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nested Comments */}
      {comment.children && comment.children.length > 0 && (
        <div className="mt-2">
          {comment.children.map(child => (
            <CommentComponent 
              key={child.id} 
              comment={child} 
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  )

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-6 bg-muted rounded w-32" />
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
          <Button onClick={loadComments} variant="outline">
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
        <h3 className="text-lg font-semibold">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comments */}
      <div className="space-y-2">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
              <p className="text-muted-foreground">
                Be the first to share your thoughts!
              </p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            {comments.map(comment => (
              <CommentComponent key={comment.id} comment={comment} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
} 